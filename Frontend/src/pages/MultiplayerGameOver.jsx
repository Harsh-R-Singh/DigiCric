import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export default function MultiplayerGameOver() {
  const containerRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const updateDbDone = useRef(false);
  
  const { gameState, currentUser, userProfile, roomId, mode } = location.state || {};

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  useEffect(() => {
    if (!gameState || updateDbDone.current) return;
    updateDbDone.current = true;

    const myPlayer = gameState.players.find(p => p.username === currentUser) || gameState.players[0];
    const opponentPlayer = gameState.players.find(p => p.username !== currentUser) || gameState.players[1];

    const isUserWin = gameState.winner === myPlayer.id;
    const isOpponentWin = gameState.winner === opponentPlayer.id;
    const isTie = gameState.winner === "tie";

    let xp = 100;
    const uBalls = myPlayer.ballsFaced || 1;
    const oBalls = opponentPlayer.ballsFaced || 1;

    if (gameState.gameFormat === '5_overs') {
      if (isUserWin) xp = (((myPlayer.score / 5) - (opponentPlayer.score / 5)) * 100);
      else if (isOpponentWin) xp = (((opponentPlayer.score / 5) - (myPlayer.score / 5)) * 100);
    } else {
      if (isUserWin) xp = (((myPlayer.score / Math.max(uBalls, oBalls)) - (opponentPlayer.score / Math.max(oBalls, uBalls))) * 100);
      else if (isOpponentWin) xp = (((opponentPlayer.score / Math.max(oBalls, uBalls)) - (myPlayer.score / Math.max(uBalls, oBalls))) * 100);
    }

    const voltsEarned = isUserWin ? Math.round(xp) : (isTie ? 0 : -Math.round(xp / 2));
    const xpEarned = isUserWin ? Math.round(xp) : (isTie ? Math.round(xp / 2) : Math.round(xp / 3));
    const netRunRate = isUserWin ? parseFloat((xp / 100).toFixed(3)) : (isTie ? 0 : parseFloat((-xp / 100).toFixed(3)));

    const formData = {
      winner: isUserWin ? 1 : 0,
      loses: isOpponentWin ? 1 : 0,
      draws: isTie ? 1 : 0,
      userScore: myPlayer.score || 0,
      runsConceded: opponentPlayer.score || 0,
      wicketsTaken: opponentPlayer.wickets || 0,
      user: currentUser,
      netRunRate: netRunRate,
      volts: voltsEarned,
      xp: xpEarned
    };

    const pushStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/users/update-stats`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include'
        });
        const data = await response.json();
        console.log("Stats updated:", data);
      } catch (error) {
        console.log("Stats update failed:", error);
      }
    };

    pushStats();
  }, [gameState, currentUser]);

  if (!gameState) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  const myPlayer = gameState.players.find(p => p.username === currentUser) || gameState.players[0];
  const opponentPlayer = gameState.players.find(p => p.username !== currentUser) || gameState.players[1];

  const formatOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainder = balls % 6;
    return `${overs}.${remainder}`;
  };

  const isUserWin = gameState.winner === myPlayer.id;
  const isOpponentWin = gameState.winner === opponentPlayer.id;
  const isTie = gameState.winner === 'tie';

  let titleText = 'MATCH TIED!';
  let titleColor = 'text-yellow-500';
  let xp = 100;
  
  if (isUserWin) {
    titleText = 'YOU WON!';
    titleColor = 'text-primary';
  } else if (isOpponentWin) {
    titleText = 'DEFEAT!';
    titleColor = 'text-red-500';
  }

  const uBalls = myPlayer.ballsFaced || 1;
  const oBalls = opponentPlayer.ballsFaced || 1;

  if (gameState.gameFormat === '5_overs') {
    if (isUserWin) xp = (((myPlayer.score / 5) - (opponentPlayer.score / 5)) * 100);
    else if (isOpponentWin) xp = (((opponentPlayer.score / 5) - (myPlayer.score / 5)) * 100);
  } else {
    if (isUserWin) xp = (((myPlayer.score / Math.max(uBalls, oBalls)) - (opponentPlayer.score / Math.max(oBalls, uBalls))) * 100);
    else if (isOpponentWin) xp = (((opponentPlayer.score / Math.max(oBalls, uBalls)) - (myPlayer.score / Math.max(uBalls, oBalls))) * 100);
  }

  const voltsEarned = isUserWin ? Math.round(xp) : (isTie ? 0 : -Math.round(xp / 2));
  const xpEarned = isUserWin ? Math.round(xp) : (isTie ? Math.round(xp / 2) : Math.round(xp / 3));
  const netRunRate = isUserWin ? parseFloat((xp / 100).toFixed(3)) : (isTie ? 0 : parseFloat((-xp / 100).toFixed(3)));

  const userStrikeRate = myPlayer.ballsFaced > 0 ? ((myPlayer.score / myPlayer.ballsFaced) * 100).toFixed(2) : '0.00';
  const opponentStrikeRate = opponentPlayer.ballsFaced > 0 ? ((opponentPlayer.score / opponentPlayer.ballsFaced) * 100).toFixed(2) : '0.00';

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col grow">

        {/* Result Section */}
        <main className="flex flex-col items-center text-center grow justify-center space-y-8">
          <div className="space-y-2 animate-in">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/20 mb-4 border border-slate-700/30">
              <span className={`material-symbols-outlined text-6xl ${titleColor}`}>
                {isUserWin ? 'emoji_events' : isTie ? 'handshake' : 'sentiment_dissatisfied'}
              </span>
            </div>
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tighter ${titleColor}`}>{titleText}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Multiplayer {gameState.gameFormat==='5_overs' ? '5 Overs' : 'Single Wicket'} {} Mode</p>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in">
            <div className={`flex flex-col items-center justify-center p-8 rounded-xl ${isUserWin ? 'bg-primary/20 border-primary' : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'} border relative overflow-hidden transition-all shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">person</span>
              </div>
              <span className={`text-sm font-semibold uppercase tracking-widest ${isUserWin ? 'text-primary' : 'text-slate-500'} mb-1`}>Your Score</span>
              <span className="text-4xl font-bold">{myPlayer.score}/{myPlayer.wickets}</span>
              <span className="text-slate-500 text-sm mt-1">({formatOvers(myPlayer.ballsFaced)} Overs)</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-8 rounded-xl ${isOpponentWin ? 'bg-red-500/20 border-red-500' : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'} border relative overflow-hidden transition-all shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">person_outline</span>
              </div>
              <span className={`text-sm font-semibold uppercase tracking-widest ${isOpponentWin ? 'text-red-500' : 'text-slate-500'} mb-1`}>{opponentPlayer.username}'s Score</span>
              <span className="text-4xl font-bold">{opponentPlayer.score}/{opponentPlayer.wickets}</span>
              <span className="text-slate-500 text-sm mt-1">({formatOvers(opponentPlayer.ballsFaced)} Overs)</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-3 animate-in">
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">bolt</span>
              <p className="text-xs text-slate-500 uppercase font-bold">NET RUN-RATE</p>
              <p className={`font-bold ${isUserWin ? 'text-primary' : 'text-slate-400'}`}>{isUserWin ? '+' : (isTie ? '' : '')}{netRunRate}</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">speed</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Your Strike Rate</p>
              <p className="font-bold">{userStrikeRate}</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">analytics</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Opponent SR</p>
              <p className="font-bold">{opponentStrikeRate}</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">stars</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Volts</p>
              <p className={`font-bold ${voltsEarned > 0 ? 'text-primary' : (voltsEarned < 0 ? 'text-red-500' : 'text-slate-400')}`}>{voltsEarned > 0 ? `+${voltsEarned}` : voltsEarned} Volts</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-purple-500 text-xl mb-2">military_tech</span>
              <p className="text-xs text-slate-500 uppercase font-bold">XP Gained</p>
              <p className="font-bold text-purple-500">+{xpEarned} XP</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-6 animate-in">
            <button onClick={() => navigate('/multiplayer', { state: { userProfile, currentUser } })} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">replay</span>
              PLAY AGAIN
            </button>
            <button onClick={() => navigate('/lobby', { state: { userProfile } })} className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">grid_view</span>
              BACK TO LOBBY
            </button>
          </div>
        </main>

        {/* Footer Info
        <footer className="mt-12 text-center text-slate-500 text-sm flex flex-col items-center gap-4">
          <p>© 2024 Hand Cricket Pro League</p>
        </footer> */}
      </div>
    </div>
  );
}
