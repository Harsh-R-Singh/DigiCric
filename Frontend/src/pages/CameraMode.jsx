import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

import { useSingleWicketGame } from '../hooks/useSingleWicketGame';
import { useFiveOverGame } from '../hooks/useFiveOverGame';

// Finger counting algorithm
const countFingers = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return 0;
  const hand = landmarks[0];
  
  // Calculate relative finger positions (y is top-down in video)
  const indexUp = hand[8].y < hand[6].y;
  const middleUp = hand[12].y < hand[10].y;
  const ringUp = hand[16].y < hand[14].y;
  const pinkyUp = hand[20].y < hand[18].y;
  
  // Thumb check: distance from tip (4) to wrist/pinky-base (17) compared to mcp (2)
  const dist4_17 = Math.hypot(hand[4].x - hand[17].x, hand[4].y - hand[17].y);
  const dist2_17 = Math.hypot(hand[2].x - hand[17].x, hand[2].y - hand[17].y);
  const thumbUp = dist4_17 > dist2_17;

  // Rule: Only Thumb = 6
  if (thumbUp && !indexUp && !middleUp && !ringUp && !pinkyUp) {
    return 6;
  }

  let count = 0;
  if (indexUp) count++;
  if (middleUp) count++;
  if (ringUp) count++;
  if (pinkyUp) count++;
  if (thumbUp) count++; 

  if (count > 5) count = 5; // Cap at 5 if more than 5 fingers detected (?)
  return count;
};

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export default function CameraMode() {
  const containerRef = useRef();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.gameFormat || 'single_wicket';
  const gameMode = location.state?.gameMode || 'camera';
  const userProfile = location.state?.userProfile;

  const singleWicketGame = useSingleWicketGame();
  const fiveOverGame = useFiveOverGame();
  const game = mode === '5_overs' ? fiveOverGame : singleWicketGame;

  const {
    phase, tossChoice, innings, userBatting,
    userScore, cpuScore, target, userLastChoice, cpuLastChoice,
    isGameOver, comments, ballsFaced, userBallsFaced, cpuBallsFaced, 
    userWickets, cpuWickets, winner, playToss, chooseToss, chooseBatOrBowl, playBall
  } = game;

  const [handLandmarker, setHandLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [fingersCount, setFingersCount] = useState(0);
  const [countdown, setCountdown] = useState(null); 
  const [gameStateActive, setGameStateActive] = useState(false);
  const [inningsBreakWait, setInningsBreakWait] = useState(false);
  const prevInnings = useRef(1);
  const updateDbDone = useRef(false);

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

  // Handle Innings Break
  useEffect(() => {
    if (innings === 2 && prevInnings.current === 1) {
      setInningsBreakWait(true);
      setGameStateActive(false); // Stop auto-round logic
      const t = setTimeout(() => {
        setInningsBreakWait(false);
      }, 3000);
      prevInnings.current = 2;
      return () => clearTimeout(t);
    }
  }, [innings]);

  // Game/Timer Loop
  useEffect(() => {
    let timer;
    if ((phase === 'toss_play' || phase === 'playing') && !isGameOver && gameStateActive && !inningsBreakWait) {
      if (countdown === null) {
        setCountdown(3);
      } else if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 500);
      } else if (countdown === 0) {
        // Action Frame! If valid play (1 to 6)
        if (fingersCount >= 1 && fingersCount <= 6) {
           if (phase === 'toss_play') playToss(fingersCount);
           else playBall(fingersCount);
           setGameStateActive(false);
        } else {
           // Invalid (0), retry immediately
           setCountdown(3);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, phase, isGameOver, gameStateActive, fingersCount, inningsBreakWait, playBall, playToss]);

  // Resume game after a play
  useEffect(() => {
    if (!gameStateActive && (phase === 'toss_play' || phase === 'playing') && !isGameOver && !inningsBreakWait) {
       // Wait 2.5s for users to see result before starting next count
       const t = setTimeout(() => {
         setCountdown(null);
         setGameStateActive(true);
       }, 2500); 
       return () => clearTimeout(t);
    }
  }, [gameStateActive, phase, isGameOver, inningsBreakWait]);

  // End Game DB push and Navigation
  useEffect(() => {
    if (isGameOver && !updateDbDone.current) {
      updateDbDone.current = true;
      const isUserWin = winner === 'user';
      const isCpuWin = winner === 'cpu';
      const isTie = winner === 'tie';

      let xp = 100;
      const uBalls = userBallsFaced || 1;
      const cBalls = cpuBallsFaced || 1;
      
      if(game=='5_overs'){
        if (isUserWin) xp = (((userScore / 5) - (cpuScore / 5))*100);
        else if (isCpuWin) xp = (((cpuScore / 5) - (userScore / 5))*100);
      }
      else{
        if (isUserWin) xp = (((userScore / Math.max(uBalls,cBalls)) - (cpuScore / Math.max(cBalls,uBalls)))*100);
        else if (isCpuWin) xp = (((cpuScore / Math.max(cBalls,uBalls)) - (userScore / Math.max(uBalls,cBalls)))*100);
      }

      const formData = {
        winner: isUserWin ? 1 : 0, loses: isCpuWin ? 1 : 0, draws: isTie ? 1 : 0,
        userScore: userScore || 0, runsConceded: cpuScore || 0, wicketsTaken: cpuWickets || 0,
        user: userProfile?.username,
        netRunRate: isUserWin ? parseFloat((xp/100).toFixed(3)) : (isTie ? 0 : parseFloat((-xp/100).toFixed(3))),
        volts: isUserWin ? Math.round(xp) : (isTie ? 0 : -Math.round(xp/2)),
        xp: isUserWin ? Math.round(xp) : (isTie ? Math.round(xp/2) : Math.round(xp/3))
      };

      fetch(`${API_URL}/api/v1/users/update-stats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      }).catch(err => console.log(err));

      setTimeout(() => {
        navigate('/game-over', { state: { 
          winner, userScore, cpuScore, userBallsFaced, cpuBallsFaced,
          userWickets: userWickets ?? 1, cpuWickets: cpuWickets ?? 1,
          target, gameFormat: mode, gameMode: gameMode, userProfile,
          netRunRate: isUserWin ? parseFloat((xp/100).toFixed(3)) : (isTie ? 0 : parseFloat((-xp/100).toFixed(3))),
          voltsEarned: isUserWin ? Math.round(xp) : (isTie ? 0 : -Math.round(xp/2)),
          xpEarned: isUserWin ? Math.round(xp) : (isTie ? Math.round(xp/2) : Math.round(xp/3))
        } });
      }, 3500); 
    }
  }, [isGameOver, navigate, winner, userScore, cpuScore, userBallsFaced, cpuBallsFaced, userWickets, cpuWickets, target, mode, gameMode, userProfile]);

  useGSAP(() => {
    gsap.from(".animate-in", { opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out" });
  }, { scope: containerRef });

  const formatOvers = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

  const renderTimerIndicator = () => {
    if (countdown === null) return "WAIT";
    if (countdown > 0) return countdown;
    return "SHOOT!";
  }

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">
        <main className="flex-1 flex flex-col items-center justify-start p-4 lg:p-8 max-w-7xl mx-auto w-full gap-6">
          
          {/* Top HUD identical to ActiveGame style */}
          <div className="w-full animate-in max-w-4xl mx-auto mb-4">
            {phase === 'playing' || isGameOver ? (
              <div className="bg-background-dark/80 backdrop-blur-md rounded-2xl border border-primary/20 p-2 shadow-xl flex flex-col md:flex-row justify-between items-stretch gap-2">
                 {/* User Score Block */}
                 <div className={`flex flex-col justify-center items-center md:items-start w-full md:w-1/3 p-4 rounded-xl border transition-all ${userBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-start w-full">
                       <p className="font-bold text-white uppercase tracking-wider text-sm">You</p>
                       {userBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                    </div>
                    <div className="flex items-baseline gap-1 justify-center md:justify-start w-full">
                      <p className="text-4xl font-bold font-display text-white">{userScore} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {userWickets}</span>}</p>
                      {userBatting && <p className="text-primary text-sm font-bold ml-1">({formatOvers(ballsFaced)} ov)</p>}
                    </div>
                 </div>

                 {/* Match Info Block */}
                 <div className="flex flex-col items-center justify-center w-full md:w-1/3 px-4 border-y md:border-y-0 md:border-x border-slate-700/50 py-4 md:py-2">
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{target ? 'Target' : 'Current Phase'}</p>
                    <p className="text-4xl font-bold font-display text-white">{target || '1st Innings'}</p>
                    <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Innings {innings}</p>
                 </div>

                 {/* CPU Score Block */}
                 <div className={`flex flex-col justify-center items-center md:items-end w-full md:w-1/3 p-4 rounded-xl border transition-all ${!userBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                    <div className="flex items-center gap-2 mb-1 justify-center md:justify-end flex-row-reverse w-full">
                       <p className="font-bold text-white uppercase tracking-wider text-sm">CPU</p>
                       {!userBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                    </div>
                    <div className="flex items-baseline gap-1 justify-center md:justify-end flex-row-reverse w-full">
                      <p className="text-4xl font-bold font-display text-white">{cpuScore} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {cpuWickets}</span>}</p>
                      {!userBatting && <p className="text-primary text-sm font-bold mr-1">({formatOvers(ballsFaced)} ov)</p>}
                    </div>
                 </div>
              </div>
            ) : (
               <div className="w-full flex flex-col gap-1 rounded-xl p-6 bg-primary/10 border border-primary/20 items-center justify-center text-center shadow-lg">
                  <p className="text-primary text-xs font-bold uppercase tracking-wider">Toss Phase</p>
                  <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                    {phase === 'toss_selection' ? 'Call Odd or Even' : phase === 'toss_play' ? `You called ${tossChoice?.toUpperCase()}` : 'Decision Time'}
                  </p>
               </div>
            )}
          </div>

          {/* Action Log Comment */}
          {comments.length > 0 && (
             <div className="bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30 z-10 text-center w-full max-w-xl mx-auto shadow-lg animate-in">
                 <p className="text-primary font-bold text-sm tracking-wide">{comments[0]}</p>
             </div>
          )}

          {/* Main Webcam Feed Arena */}
          <div className="relative w-full max-w-4xl aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 group animate-in">
            <video 
              ref={videoRef} 
              autoPlay playsInline muted 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100 opacity-60"
            />
            
            {/* Countdown Overlay */}
            {(phase === 'toss_play' || phase === 'playing') && !isGameOver && !inningsBreakWait && gameStateActive && (
                 <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                     <span className={`text-[12rem] font-black italic drop-shadow-[0_0_15px_rgba(236,91,19,0.8)] ${countdown === 0 ? 'text-green-500 scale-125' : 'text-primary animate-pulse'} transition-transform duration-200`}>
                       {renderTimerIndicator()}
                     </span>
                 </div>
            )}

            {/* AI Bounding Box UI showing current detected count */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-primary/80 rounded-3xl flex items-center justify-center overflow-visible">
                <div className="absolute -top-6 bg-primary px-4 py-1 rounded-full text-white text-xs font-bold tracking-widest shadow-md">
                   {fingersCount > 0 ? "HAND DETECTED" : "NO HAND FOUND"}
                </div>
                <div className="absolute -bottom-6 bg-background-dark/80 px-6 py-2 rounded-full flex gap-3 items-center border border-primary/30">
                  <span className="text-2xl font-black text-primary drop-shadow-md">{fingersCount}</span>
                  <span className="text-[10px] font-bold uppercase text-white/70 tracking-widest leading-none">Detected<br/>Fingers</span>
                </div>
              </div>
            </div>

            {/* In-Game Opponent Stats / Played Values */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
               {userLastChoice && (
                 <div className="bg-background-dark/90 px-4 py-2 rounded-xl border border-primary flex flex-col items-center shadow-lg">
                   <span className="text-[10px] font-bold text-white/50 uppercase whitespace-nowrap">You Played</span>
                   <span className="text-2xl font-black text-primary">{userLastChoice}</span>
                 </div>
               )}
               {cpuLastChoice && (
                 <div className="bg-background-dark/90 px-4 py-2 rounded-xl border border-slate-500 flex flex-col items-center shadow-lg">
                   <span className="text-[10px] font-bold text-white/50 uppercase whitespace-nowrap">CPU Played</span>
                   <span className="text-2xl font-black text-slate-400">{cpuLastChoice}</span>
                 </div>
               )}
            </div>
            
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>
          </div>

          {/* Menus / Manual Controls */}
          <div className="w-full max-w-4xl flex flex-col gap-6 pb-8 animate-in text-center">
             
            {phase === 'toss_selection' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold font-display">Toss Call</h3>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                  <button onClick={() => chooseToss('odd')} className="group p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all">
                    <span className="text-3xl font-bold dark:text-white group-hover:text-white font-display">ODD</span>
                  </button>
                  <button onClick={() => chooseToss('even')} className="group p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all">
                    <span className="text-3xl font-bold dark:text-white group-hover:text-white font-display">EVEN</span>
                  </button>
                </div>
              </div>
            )}

            {phase === 'toss_decision' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold font-display">Choose to Bat or Bowl</h3>
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                  <button onClick={() => { chooseBatOrBowl('bat'); setGameStateActive(true); }} className="group p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all">
                    <span className="text-3xl font-bold dark:text-white group-hover:text-white font-display">BAT</span>
                  </button>
                  <button onClick={() => { chooseBatOrBowl('bowl'); setGameStateActive(true); }} className="group p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all">
                    <span className="text-3xl font-bold dark:text-white group-hover:text-white font-display">BOWL</span>
                  </button>
                </div>
              </div>
            )}

            {(phase === 'toss_play' || phase === 'playing') && !gameStateActive && !inningsBreakWait && !isGameOver && (
              <div className="flex justify-center mt-4">
                 <button onClick={() => setGameStateActive(true)} className="bg-primary px-8 py-3 rounded-full text-white font-bold tracking-widest shadow-[0_0_20px_rgba(236,91,19,0.3)] animate-pulse">
                   CLICK TO START NEXT ROUND
                 </button>
              </div>
            )}

            {inningsBreakWait && (
              <div className="text-center py-6 bg-primary/10 rounded-xl border border-primary/20 animate-in mx-auto w-full max-w-md mt-4">
                 <h3 className="text-primary text-2xl font-bold font-display animate-pulse">Innings Break!</h3>
                 <p className="text-slate-500 font-medium mt-2">Get ready to {userBatting ? 'Bat' : 'Bowl'}! Target is {target}</p>
                 <button onClick={() => { setInningsBreakWait(false); setGameStateActive(true); }} className="mt-4 bg-primary px-6 py-2 rounded-full text-white font-bold text-sm">
                   Continue Now
                 </button>
              </div>
            )}

            {isGameOver && (
              <div className="text-center py-4 bg-primary/10 rounded-xl border border-primary/20 mt-4 max-w-md mx-auto">
                 <h3 className="text-primary text-xl font-bold font-display animate-pulse">Match Finished! Proceeding to results...</h3>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6 p-4 border-t border-slate-700/20 w-full">
               <div className="flex gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Camera</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500">
                      <span className="material-symbols-outlined text-xs">videocam</span> {webcamRunning ? 'Ready' : 'Waiting...'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Engine</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined text-xs">memory</span> {handLandmarker ? 'Active' : 'Loading...'}
                    </div>
                  </div>
               </div>
               {/* <Link to="/lobby" className="bg-slate-200 dark:bg-primary/10 hover:bg-slate-300 dark:hover:bg-primary/20 text-slate-700 dark:text-primary font-bold py-2 px-6 rounded-xl border border-primary/20 transition-all">
                  FORFEIT
               </Link> */}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
