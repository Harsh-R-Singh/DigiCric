import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ActiveGame() {
  const navigate = useNavigate();
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });
  
  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen w-full flex flex-col">
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 gap-6">
        {/* Scoreboard Section */}
        <div className="grid grid-cols-3 gap-4 animate-in">
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-primary/10 border border-primary/20 items-center justify-center">
            <p className="text-primary text-xs font-bold uppercase tracking-wider">Runs</p>
            <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">42</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-primary/10 border border-primary/20 items-center justify-center">
            <p className="text-primary text-xs font-bold uppercase tracking-wider">Wickets</p>
            <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">1</p>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-primary text-white items-center justify-center shadow-lg shadow-primary/20">
            <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Target</p>
            <p className="text-3xl font-bold font-display">85</p>
          </div>
        </div>

        {/* Game Arena / Split View */}
        <div className="flex-1 stadium-gradient rounded-2xl overflow-hidden relative border border-white/10 min-h-[400px] flex flex-col justify-center animate-in">
          <div className="flex justify-around items-center w-full px-4 gap-8">
            {/* Player Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-primary bg-background-dark/80 flex items-center justify-center text-primary overflow-hidden">
                  <img alt="Player Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLfq4cz8N5xASugyuH6a3-VPqC2FlGZJ1fe0cpqh9tQTgeRLqVLgpMFRo_JePykl7Nd9oLi7cVzXfA170TKIKAlfNs4z9ZP6S814VgmIptcPiXLBpcpU_sHRE0J_RG43-M5O7DMpGTJdzD3jWqobes8_ZAnnvA2NuRKFNAe_6vIqd8X7uyYyyZYHdWxbeWQDaoUgd8EDDIzWDwbdsga6XI4zYGx7MiM4TTLvkdqGtywksH1EJ1ibMthlbCNc5mHNQohJ5xMKnTmlM" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase">You</div>
              </div>
              <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-white font-display">4</span>
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <div className="text-primary font-bold text-2xl font-display my-2 italic">VS</div>
              <div className="h-16 w-0.5 bg-gradient-to-b from-primary via-primary to-transparent"></div>
            </div>

            {/* CPU Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-slate-500 bg-background-dark/80 flex items-center justify-center text-slate-400 overflow-hidden">
                  <img alt="CPU Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpxlZ0loTDpxwg0HRlhWUGl_0R-N215f0q4Q1chcr0Mg10bNIjak87cVV8LgP5S6U2uXzkk7KhNbDi-37ODnVEBIpYbNi8YHKuUS1M4lAV4Znzq-YVs3E_8t9f8_QFOm6CE1OOS0aNW5CZ6s_bT40Tabe1BhIMiSqMbR5kO_tnj96jXIUz6dHYjneSUa0fuQG1eNMpDelTqn5aY3x5bi5BjqU90WTqnN-wjsg948teHBwim5rclkcdOKIC4_Sw28NlLfXrhdGkHMc" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-600 px-3 py-1 rounded-full text-xs font-bold text-white uppercase">CPU</div>
              </div>
              <div className="w-20 h-20 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/40 flex items-center justify-center shadow-[0_0_20px_rgba(236,91,19,0.3)]">
                <span className="text-4xl font-bold text-white font-display">2</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30">
            <p className="text-primary font-medium text-sm">Need 43 runs from 18 balls</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-6 pb-8 animate-in">
          <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display">Choose your move</h3>
          <div className="grid grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button key={num} onClick={() => navigate('/game-over')} className="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200">
                <span className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display leading-none">{num}</span>
                <span className="material-symbols-outlined text-primary group-hover:text-white">
                  {num % 2 === 0 ? 'celebration' : 'back_hand'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>10 seconds to play</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Match Live</span>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}
