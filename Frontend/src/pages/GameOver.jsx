import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function GameOver() {
  const containerRef = useRef();
  const location = useLocation();
  
  // Default fallback if navigated directly without state
  const state = location.state || {
    winner: 'tie',
    userScore: 0,
    cpuScore: 0,
    userBallsFaced: 0,
    cpuBallsFaced: 0,
  };

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const formatOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainder = balls % 6;
    return `${overs}.${remainder}`;
  };

  const isUserWin = state.winner === 'user';
  const isCpuWin = state.winner === 'cpu';
  const isTie = state.winner === 'tie';

  let titleText = 'MATCH TIED!';
  let titleColor = 'text-yellow-500';
  let xp = 200;
  
  if (isUserWin) {
    titleText = 'YOU WIN!';
    titleColor = 'text-primary';
    xp = 500;
  } else if (isCpuWin) {
    titleText = 'DEFEAT!';
    titleColor = 'text-red-500';
    xp = 50;
  }

  const userStrikeRate = state.userBallsFaced > 0 ? ((state.userScore / state.userBallsFaced) * 100).toFixed(2) : '0.00';
  const cpuStrikeRate = state.cpuBallsFaced > 0 ? ((state.cpuScore / state.cpuBallsFaced) * 100).toFixed(2) : '0.00';

  const highestScore = Math.max(state.userScore, state.cpuScore);
  const highestScorer = state.userScore > state.cpuScore ? 'You' : (state.cpuScore > state.userScore ? 'CPU' : 'Tie');

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
            <p className="text-slate-500 dark:text-slate-400 text-lg">{state.gameFormat}</p>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in">
            <div className={`flex flex-col items-center justify-center p-8 rounded-xl ${isUserWin ? 'bg-primary/20 border-primary' : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'} border relative overflow-hidden transition-all shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">person</span>
              </div>
              <span className={`text-sm font-semibold uppercase tracking-widest ${isUserWin ? 'text-primary' : 'text-slate-500'} mb-1`}>Your Score</span>
              <span className="text-4xl font-bold">{state.userScore}</span>
              <span className="text-slate-500 text-sm mt-1">({formatOvers(state.userBallsFaced)} Overs)</span>
            </div>
            <div className={`flex flex-col items-center justify-center p-8 rounded-xl ${isCpuWin ? 'bg-red-500/20 border-red-500' : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'} border relative overflow-hidden transition-all shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">smart_toy</span>
              </div>
              <span className={`text-sm font-semibold uppercase tracking-widest ${isCpuWin ? 'text-red-500' : 'text-slate-500'} mb-1`}>CPU Score</span>
              <span className="text-4xl font-bold">{state.cpuScore}</span>
              <span className="text-slate-500 text-sm mt-1">({formatOvers(state.cpuBallsFaced)} Overs)</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 animate-in">
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">bolt</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Highest Score</p>
              <p className="font-bold">{highestScorer} ({highestScore})</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">speed</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Your Strike Rate</p>
              <p className="font-bold">{userStrikeRate}</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">analytics</span>
              <p className="text-xs text-slate-500 uppercase font-bold">CPU Strike Rate</p>
              <p className="font-bold">{cpuStrikeRate}</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">stars</span>
              <p className="text-xs text-slate-500 uppercase font-bold">XP Gained</p>
              <p className={`font-bold ${isUserWin ? 'text-primary' : 'text-slate-400'}`}>+{xp} XP</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-6 animate-in">
            <Link to="/game" state={{ gameFormat: state.gameFormat }} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">replay</span>
              REMATCH
            </Link>
            <Link to="/lobby" className="flex-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">grid_view</span>
              BACK TO LOBBY
            </Link>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-slate-500 text-sm flex flex-col items-center gap-4">
          <p>© 2024 Hand Cricket Pro League</p>
        </footer>
      </div>
    </div>
  );
}
