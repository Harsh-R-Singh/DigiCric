import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { io } from 'socket.io-client';

const countFingers = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return 0;
  const hand = landmarks[0];
  
  const indexUp = hand[8].y < hand[6].y;
  const middleUp = hand[12].y < hand[10].y;
  const ringUp = hand[16].y < hand[14].y;
  const pinkyUp = hand[20].y < hand[18].y;
  
  const dist4_17 = Math.hypot(hand[4].x - hand[17].x, hand[4].y - hand[17].y);
  const dist2_17 = Math.hypot(hand[2].x - hand[17].x, hand[2].y - hand[17].y);
  const thumbUp = dist4_17 > dist2_17;

  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    return 6;
  }

  let count = 0;
  if (indexUp) count++;
  if (middleUp) count++;
  if (ringUp) count++;
  if (pinkyUp) count++;
  if (thumbUp) count++; 

  if (count > 5) count = 5;
  return count;
};

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:8000';

export default function MultiplayerCameraMode() {
  const containerRef = useRef();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { roomId, gameState: initialGameState, currentUser, userProfile } = location.state || {};

  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(initialGameState);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [fingersCount, setFingersCount] = useState(0);
  
  const [countdown, setCountdown] = useState(null); 
  const [isActive, setIsActive] = useState(false);

  const [lastPlay, setLastPlay] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [inningsBreakWait, setInningsBreakWait] = useState(false);

  useEffect(() => {
    if (!roomId || !currentUser) {
      navigate('/lobby');
      return;
    }

    const newSocket = io(API_URL, {
      withCredentials: true
    });

    newSocket.on("connect", () => {
      // Rejoin room if possible, but for simplicity just connect and listen
      newSocket.emit("joinRoom", { roomId, username: currentUser }); // In reality it might fail if already 2 players, but we just need to bind to the socket server
    });

    newSocket.on("gameStateUpdate", (data) => {
      setGameState(prevState => {
         if (data.gameState.innings === 2 && prevState?.innings === 1) {
            setInningsBreakWait(true);
         }
         return data.gameState;
      });
      setHasPlayed(false);
      if (data.lastPlay) {
         setLastPlay(data.lastPlay);
         // Show results then reset
         setTimeout(() => {
           setLastPlay(null);
         }, 2500);
      }
      
      if (data.gameState.state === "game_over") {
         setTimeout(() => {
            navigate('/multiplayer-game-over', {
               state: {
                  gameState: data.gameState,
                  currentUser,
                  userProfile,
                  roomId,
                  mode: data.gameState.gameFormat
               }
            });
         }, 4000);
      }
    });

    newSocket.on("opponentDisconnected", () => {
      setOpponentDisconnected(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveRoom", {roomId});
      newSocket.disconnect();
    };
  }, [roomId, currentUser, navigate]);

  // Auto-start round when appropriate
  useEffect(() => {
    if (!gameState) return;
    if ((gameState.state === "toss_play" || gameState.state === "playing") && 
        !isActive && 
        !lastPlay && 
        !inningsBreakWait && 
        !hasPlayed) {
       setIsActive(true);
       setCountdown(3);
    }
  }, [gameState.state, isActive, lastPlay, inningsBreakWait, hasPlayed]);

  // Load MediaPipe
  useEffect(() => {
    const initLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        setHandLandmarker(landmarker);
      } catch (err) {
        console.error("Vision Tasks Error:", err);
      }
    };
    initLandmarker();
  }, []);

  // Initialize Webcam
  useEffect(() => {
    if (!handLandmarker) return;
    let stream;
    const startCam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => setWebcamRunning(true));
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };
    startCam();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [handLandmarker]);

  // Video Prediction Loop
  useEffect(() => {
    let animationFrameId;
    let lastVideoTime = -1;

    const renderLoop = async () => {
      if (webcamRunning && handLandmarker && videoRef.current && videoRef.current.readyState >= 2) {
        let startTimeMs = performance.now();
        if (lastVideoTime !== videoRef.current.currentTime) {
          lastVideoTime = videoRef.current.currentTime;
          const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
          if (results.landmarks.length > 0) {
            setFingersCount(countFingers(results.landmarks));
          } else {
            setFingersCount(0);
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [webcamRunning, handLandmarker]);

  // Game Loop
  useEffect(() => {
    let timer;
    if (isActive && !opponentDisconnected && !inningsBreakWait) {
       if (countdown > 0) {
          timer = setTimeout(() => setCountdown(countdown - 1), 700); // Slower for network latency padding
       } else if (countdown === 0) {
          if (fingersCount >= 1 && fingersCount <= 6) {
             setIsActive(false);
             setHasPlayed(true);
             if (gameState.state === "toss_play") {
                socket.emit("playNumber", { roomId, number: fingersCount });
             } else if (gameState.state === "playing") {
                socket.emit("playNumber", { roomId, number: fingersCount });
             }
          } else {
             // Invalid, retry immediately
             setCountdown(3);
          }
       }
    }
    return () => clearTimeout(timer);
  }, [countdown, isActive, fingersCount, socket, roomId, gameState, opponentDisconnected, inningsBreakWait]);

  useGSAP(() => {
    gsap.from(".animate-in", { opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out" });
  }, { scope: containerRef });

  if (!gameState) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const myPlayer = gameState.players.find(p => p.id === socket?.id) || gameState.players[0];
  const opponentPlayer = gameState.players.find(p => p.id !== socket?.id) || gameState.players[1] || {username: 'Waiting...', score: 0, wickets: 0};
  
  const isMyTurnForToss = gameState.state === "toss_selection" && gameState.turn === socket?.id;
  const isMyTurnForDecision = gameState.state === "toss_decision" && gameState.tossWinner === socket?.id;
  
  const amIBatting = gameState.battingPlayerId === socket?.id;

  const batter = amIBatting ? myPlayer : opponentPlayer;
  const bowler = amIBatting ? opponentPlayer : myPlayer;

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pt-20">
       <div className="max-w-6xl mx-auto p-4 flex flex-col items-center gap-6">
         
         {opponentDisconnected && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-center font-bold">
               Opponent Disconnected. <button onClick={() => navigate('/lobby')} className="underline">Leave Game</button>
            </div>
         )}

         {/* Scorecard */}
         {(gameState.state === "playing" || gameState.state === "game_over") && (
            <div className="w-full flex justify-between bg-primary/10 border border-primary/20 p-4 rounded-xl animate-in">
               <div className={`flex flex-col ${amIBatting ? 'text-primary' : 'text-slate-400'}`}>
                  <span className="font-bold">{myPlayer.username} (You) - {amIBatting ? 'Batting' : 'Bowling'}</span>
                  <span className="text-3xl font-black">{myPlayer.score}/{myPlayer.wickets} <span className="text-sm font-normal">({Math.floor(myPlayer.ballsFaced/6)}.{myPlayer.ballsFaced%6} ov)</span></span>
               </div>
               <div className="flex flex-col items-center justify-center border-x border-primary/20 px-8">
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Innings {gameState.innings}</span>
                  {gameState.target && <span className="font-bold text-xl">Target: {gameState.target + 1}</span>}
               </div>
               <div className={`flex flex-col text-right ${!amIBatting ? 'text-primary' : 'text-slate-400'}`}>
                  <span className="font-bold">{opponentPlayer.username} - {!amIBatting ? 'Batting' : 'Bowling'}</span>
                  <span className="text-3xl font-black">{opponentPlayer.score}/{opponentPlayer.wickets} <span className="text-sm font-normal">({Math.floor(opponentPlayer.ballsFaced/6)}.{opponentPlayer.ballsFaced%6} ov)</span></span>
               </div>
            </div>
         )}

         {/* Video Feed */}
         <div className="relative w-full max-w-4xl aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden border-4 border-primary/20 animate-in">
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-60" />
            
            {/* Countdown */}
            {isActive && !inningsBreakWait && (
               <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                  <span className={`text-[12rem] font-black italic drop-shadow-[0_0_15px_rgba(236,91,19,0.8)] ${countdown === 0 ? 'text-green-500 scale-125' : 'text-primary animate-pulse'}`}>
                     {countdown > 0 ? countdown : "SHOOT!"}
                  </span>
               </div>
            )}

            {/* Waiting for other player */}
            {!isActive && (gameState.state === "toss_play" || gameState.state === "playing") && !lastPlay && !inningsBreakWait && hasPlayed && (
               <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/60">
                  <span className="text-3xl md:text-4xl text-white font-bold tracking-widest animate-pulse">Waiting for opponent...</span>
               </div>
            )}

            {/* Detected count */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
               <div className="relative w-64 h-64 border-2 border-dashed border-primary/80 rounded-3xl flex items-center justify-center">
                  <div className="absolute -bottom-6 bg-background-dark/80 px-6 py-2 rounded-full flex gap-3 items-center border border-primary/30">
                     <span className="text-2xl font-black text-primary">{fingersCount}</span>
                  </div>
               </div>
            </div>

            {/* Last Play Results */}
            {lastPlay && (
               <div className="absolute bottom-6 right-6 bg-background-dark/90 px-6 py-4 rounded-xl border border-primary flex gap-8">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] text-white/50 uppercase">Batter</span>
                     <span className="text-3xl font-black text-white">{lastPlay.batterNumber}</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] text-white/50 uppercase">Bowler</span>
                     <span className="text-3xl font-black text-slate-400">{lastPlay.bowlerNumber}</span>
                  </div>
               </div>
            )}
         </div>

         {/* Info & Controls */}
         <div className="w-full text-center animate-in min-h-[150px]">
            {gameState.state === "toss_selection" && (
               <div>
                  <h3 className="text-xl font-bold mb-4">{isMyTurnForToss ? 'Choose Odd or Even' : 'Waiting for opponent to call Toss...'}</h3>
                  {isMyTurnForToss && (
                     <div className="flex justify-center gap-4">
                        <button onClick={() => socket.emit("tossCall", {roomId, choice: 'odd'})} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xl">ODD</button>
                        <button onClick={() => socket.emit("tossCall", {roomId, choice: 'even'})} className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-xl">EVEN</button>
                     </div>
                  )}
               </div>
            )}

            {gameState.state === "toss_play" && (
               <div>
                  <h3 className="text-xl font-bold">Toss Play: Throw a number!</h3>
                  <p className="text-slate-400">Winner called {gameState.tossChoice}</p>
               </div>
            )}

            {gameState.state === "toss_decision" && (
               <div>
                  <h3 className="text-xl font-bold mb-4">{isMyTurnForDecision ? 'You won the Toss! Bat or Bowl?' : 'Opponent won Toss. Waiting for decision...'}</h3>
                  {isMyTurnForDecision && (
                     <div className="flex justify-center gap-4">
                        <button onClick={() => socket.emit("tossDecision", {roomId, decision: 'bat'})} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xl">BAT</button>
                        <button onClick={() => socket.emit("tossDecision", {roomId, decision: 'bowl'})} className="bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-xl">BOWL</button>
                     </div>
                  )}
               </div>
            )}

            {inningsBreakWait && (
               <div className="bg-primary/20 p-6 rounded-xl border border-primary/30 inline-block">
                  <h3 className="text-2xl font-bold text-primary mb-2">Innings Break!</h3>
                  <p>Target is {gameState.target + 1}</p>
                  <button onClick={() => setInningsBreakWait(false)} className="mt-4 bg-primary px-6 py-2 rounded-full text-white font-bold">Continue</button>
               </div>
            )}

            {gameState.state === "game_over" && (
               <div className="bg-primary/20 p-6 rounded-xl border border-primary/30 inline-block">
                  <h3 className="text-2xl font-bold text-primary mb-2">Match Finished!</h3>
                  <p className="text-xl">
                     {gameState.winner === socket?.id ? "YOU WON!" : (gameState.winner === "tie" ? "MATCH TIED!" : "YOU LOST!")}
                  </p>
               </div>
            )}
         </div>

       </div>
    </div>
  );
}
