import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:8000';
const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};

export default function MultiplayerClassicMode() {
  const containerRef = useRef();
  const userHandRef = useRef();
  const cpuHandRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const { roomId, gameState: initialGameState, currentUser, userProfile,avatar } = location.state || {};

  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(initialGameState);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const [lastPlay, setLastPlay] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [inningsBreakWait, setInningsBreakWait] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!roomId || !currentUser) {
      navigate('/lobby');
      return;
    }

    const newSocket = io(API_URL, {
      withCredentials: true
    });

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", { roomId, username: currentUser }); 
    });

    newSocket.on("gameStateUpdate", (data) => {
      setGameState(prevState => {
         if (data.gameState.innings === 2 && prevState?.innings === 1) {
            setInningsBreakWait(true);
         }
         return data.gameState;
      });
      setHasPlayed(false);
      
      if(data.gameState.logs && data.gameState.logs.length > 0) {
        setComments(data.gameState.logs);
      }

      if (data.lastPlay) {
         setLastPlay(data.lastPlay);
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

  useGSAP(() => {
    gsap.from(".animate-in", { opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: "power3.out" });
  }, { scope: containerRef });

  useGSAP(() => {
    if (lastPlay !== null) {
      gsap.fromTo(userHandRef.current, 
        { scale: 0.5, y: 20, opacity: 0, rotation: -15 }, 
        { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }
      );
      gsap.fromTo(cpuHandRef.current, 
        { scale: 0.5, y: 20, opacity: 0, rotation: 15 }, 
        { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", delay: 0.1 }
      );
    }
  }, { dependencies: [lastPlay] });

  if (!gameState) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  const myPlayer = gameState.players.find(p => p.id === socket?.id) || gameState.players[0];
  const opponentPlayer = gameState.players.find(p => p.id !== socket?.id) || gameState.players[1] || {username: 'Waiting...', score: 0, wickets: 0};
  
  const isMyTurnForToss = gameState.state === "toss_selection" && gameState.turn === socket?.id;
  const isMyTurnForDecision = gameState.state === "toss_decision" && gameState.tossWinner === socket?.id;
  
  const amIBatting = gameState.battingPlayerId === socket?.id;
  const target = gameState.target;
  const innings = gameState.innings;
  const phase = gameState.state;
  const isGameOver = phase === "game_over";

  const mode = gameState.gameFormat;
  const userHasPlayed = hasPlayed || (phase === 'toss_play' ? gameState.tossPlays[socket?.id] : gameState.currentPlays[socket?.id]);

  const formatOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainder = balls % 6;
    return `${overs}.${remainder}`;
  };

  const playNumber = (num) => {
    if (phase === 'toss_play') {
       socket.emit("playNumber", { roomId, number: num });
       setHasPlayed(true);
    } else if (phase === 'playing' && !inningsBreakWait) {
       socket.emit("playNumber", { roomId, number: num });
       setHasPlayed(true);
    }
  };

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen pt-20 flex flex-col">
       <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 gap-6">
         
         {opponentDisconnected && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-center font-bold">
               Opponent Disconnected. <button onClick={() => navigate('/lobby')} className="underline">Leave Game</button>
            </div>
         )}

        {/* Scoreboard Section */}
        <div className="w-full animate-in mb-4">
          {phase === 'playing' || isGameOver ? (
            <div className="bg-background-dark/80 backdrop-blur-md rounded-2xl border border-primary/20 p-2 shadow-xl flex flex-col md:flex-row justify-between items-stretch gap-2">
               {/* User Score Block */}
               <div className={`flex flex-col justify-center items-center md:items-start w-full md:w-1/3 p-4 rounded-xl border transition-all ${amIBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start w-full">
                     <p className="font-bold text-white uppercase tracking-wider text-sm">You</p>
                     {amIBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                  </div>
                  <div className="flex items-baseline gap-1 justify-center md:justify-start w-full">
                    <p className="text-4xl font-bold font-display text-white">{myPlayer.score} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {myPlayer.wickets}</span>}</p>
                    {amIBatting && <p className="text-primary text-sm font-bold ml-1">({formatOvers(myPlayer.ballsFaced)} ov)</p>}
                  </div>
               </div>

               {/* Match Info Block */}
               <div className="flex flex-col items-center justify-center w-full md:w-1/3 px-4 border-y md:border-y-0 md:border-x border-slate-700/50 py-4 md:py-2">
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{target ? 'Target' : 'Current Phase'}</p>
                  <p className="text-4xl font-bold font-display text-white">{target ? target + 1 : '1st Innings'}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Innings {innings}</p>
               </div>

               {/* CPU Score Block */}
               <div className={`flex flex-col justify-center items-center md:items-end w-full md:w-1/3 p-4 rounded-xl border transition-all ${!amIBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-end flex-row-reverse w-full">
                     <p className="font-bold text-white uppercase tracking-wider text-sm">{opponentPlayer.username}</p>
                     {!amIBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                  </div>
                  <div className="flex items-baseline gap-1 justify-center md:justify-end flex-row-reverse w-full">
                    <p className="text-4xl font-bold font-display text-white">{opponentPlayer.score} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {opponentPlayer.wickets}</span>}</p>
                    {!amIBatting && <p className="text-primary text-sm font-bold mr-1">({formatOvers(opponentPlayer.ballsFaced)} ov)</p>}
                  </div>
               </div>
            </div>
          ) : (
             <div className="w-full flex flex-col gap-1 rounded-xl p-6 bg-primary/10 border border-primary/20 items-center justify-center text-center shadow-lg">
                <p className="text-primary text-xs font-bold uppercase tracking-wider">Toss Phase</p>
                <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {phase === 'toss_selection' ? 'Call Odd or Even' : phase === 'toss_play' ? `Winner called ${gameState.tossChoice?.toUpperCase()}` : 'Decision Time'}
                </p>
             </div>
          )}
        </div>

        {/* Game Arena / Split View */}
        <div className="flex-1 stadium-gradient rounded-2xl overflow-hidden relative border border-white/10 min-h-[400px] flex flex-col justify-center animate-in">
          
          {comments.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30 z-10 text-center w-[90%] md:w-auto shadow-lg">
              <p className="text-primary font-bold text-sm">{comments[0]}</p>
            </div>
          )}

          <div className="flex justify-around items-center w-full px-4 gap-8">
            {/* Player Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-primary bg-background-dark/80 flex items-center justify-center text-primary overflow-hidden shadow-[0_0_20px_rgba(236,91,19,0.2)]">
                  <img alt="Player Avatar" className="w-full h-full object-cover" src={getAvatarUrl(userProfile?.avatar)} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap">
                  You {phase === 'playing' ? (amIBatting ? '(Batting)' : '(Bowling)') : ''}
                </div>
              </div>
              <div ref={userHandRef} className="w-20 h-20 bg-background-dark/50 backdrop-blur-md rounded-xl border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                <span className="text-4xl font-bold font-display">
                  {lastPlay ? (amIBatting ? lastPlay.batterNumber : lastPlay.bowlerNumber) : '?'}
                </span>
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <div className="text-primary font-bold text-2xl font-display my-2 italic">VS</div>
              <div className="h-16 w-0.5 bg-gradient-to-b from-primary via-primary to-transparent"></div>
            </div>

            {/* Opponent Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-slate-500 bg-background-dark/80 flex items-center justify-center text-slate-400 overflow-hidden shadow-lg">
                   {/* In a real scenario we could send opponent's avatar, using a placeholder or default for now */}
                  <img alt="Opponent Avatar" className="w-full h-full object-cover" src={getAvatarUrl(avatar||"Avatar2")} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-600 px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap">
                  {opponentPlayer.username} {phase === 'playing' ? (!amIBatting ? '(Batting)' : '(Bowling)') : ''}
                </div>
              </div>
              <div ref={cpuHandRef} className="w-20 h-20 bg-background-dark/50 backdrop-blur-md rounded-xl border border-slate-500/30 flex items-center justify-center text-slate-400 shadow-inner">
                <span className="text-4xl font-bold font-display">
                   {lastPlay ? (!amIBatting ? lastPlay.batterNumber : lastPlay.bowlerNumber) : '?'}
                </span>
              </div>
            </div>
          </div>

          {phase === 'playing' && target && innings === 2 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30 text-center w-[90%] md:w-auto">
              <p className="text-primary font-medium text-sm">Need {(target + 1) - (amIBatting ? myPlayer.score : opponentPlayer.score)} more runs to win</p>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-6 pb-8 animate-in min-h-[200px]">
          
          {phase === 'toss_selection' && (
             <div>
               <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display mb-4">
                  {isMyTurnForToss ? 'Toss Call' : 'Waiting for opponent to call Toss...'}
               </h3>
               {isMyTurnForToss && (
                 <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                   <button onClick={() => socket.emit("tossCall", {roomId, choice: 'odd'})} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">ODD</span>
                   </button>
                   <button onClick={() => socket.emit("tossCall", {roomId, choice: 'even'})} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">EVEN</span>
                   </button>
                 </div>
               )}
             </div>
          )}

          {phase === 'toss_decision' && (
             <div>
               <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display mb-4">
                 {isMyTurnForDecision ? 'Choose to Bat or Bowl' : 'Waiting for opponent decision...'}
               </h3>
               {isMyTurnForDecision && (
                 <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                   <button onClick={() => socket.emit("tossDecision", {roomId, decision: 'bat'})} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">BAT</span>
                   </button>
                   <button onClick={() => socket.emit("tossDecision", {roomId, decision: 'bowl'})} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                     <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">BOWL</span>
                   </button>
                 </div>
               )}
             </div>
          )}

          {(phase === 'toss_play' || phase === 'playing') && !isGameOver && !inningsBreakWait && !lastPlay && !userHasPlayed && (
            <>
              <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display">
                {phase === 'toss_play' ? 'Play for Toss' : 'Choose your move'}
              </h3>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button 
                    key={num} 
                    onClick={() => playNumber(num)} 
                    className="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary active:scale-[0.95] transition-all duration-200"
                  >
                    <span className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display leading-none">{num}</span>
                    <span className="material-symbols-outlined text-primary group-hover:text-white">
                      {num % 2 === 0 ? 'celebration' : 'back_hand'}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {lastPlay && (
            <div className="text-center py-4">
               <h3 className="text-xl font-bold text-slate-500 animate-pulse">Play resolving...</h3>
            </div>
          )}
          
          {(phase === 'toss_play' || phase === 'playing') && !isGameOver && !inningsBreakWait && !lastPlay && userHasPlayed && (
             <div className="text-center py-4">
                <h3 className="text-xl font-bold text-slate-500 animate-pulse">Waiting for opponent to play...</h3>
             </div>
          )}


          {inningsBreakWait && (
            <div className="text-center py-6 bg-primary/10 rounded-xl border border-primary/20 animate-in">
               <h3 className="text-primary text-2xl font-bold font-display animate-pulse">Innings Break!</h3>
               <p className="text-slate-500 font-medium mt-2">Target is {target + 1}</p>
               <button onClick={() => setInningsBreakWait(false)} className="mt-4 bg-primary px-6 py-2 rounded-full text-white font-bold">Continue</button>
            </div>
          )}

          {isGameOver && (
            <div className="text-center py-4 bg-primary/10 rounded-xl border border-primary/20">
               <h3 className="text-primary text-xl font-bold font-display animate-pulse">Match Finished! Proceeding to lobby...</h3>
            </div>
          )}

        </div>
       </main>
    </div>
  );
}
