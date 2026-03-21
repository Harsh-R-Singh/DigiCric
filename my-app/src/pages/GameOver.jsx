import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function GameOver() {
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
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col grow">


        {/* Result Section */}
        <main className="flex flex-col items-center text-center grow justify-center space-y-8">
          <div className="space-y-2 animate-in">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 mb-4">
              <span className="material-symbols-outlined text-primary text-6xl">emoji_events</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tighter">YOU WIN!</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Championship Series • Match #1,242</p>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in">
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">person</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">Your Score</span>
              <span className="text-4xl font-bold">148 / 4</span>
              <span className="text-slate-500 text-sm mt-1">(10.0 Overs)</span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <span className="material-symbols-outlined text-8xl">smart_toy</span>
              </div>
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-1">Opponent</span>
              <span className="text-4xl font-bold">132 / 10</span>
              <span className="text-slate-500 text-sm mt-1">(9.2 Overs)</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 animate-in">
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">bolt</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Most Runs</p>
              <p className="font-bold">Rahul (62)</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">target</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Most Wickets</p>
              <p className="font-bold">You (4)</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">speed</span>
              <p className="text-xs text-slate-500 uppercase font-bold">Strike Rate</p>
              <p className="font-bold">148.00</p>
            </div>
            <div className="p-4 rounded-lg glass-panel text-left">
              <span className="material-symbols-outlined text-primary text-xl mb-2">stars</span>
              <p className="text-xs text-slate-500 uppercase font-bold">XP Gained</p>
              <p className="font-bold text-primary">+450 XP</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-6 animate-in">
            <Link to="/game" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
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
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDm16CRFAL9DoIQPCi-jH1uG_K-htMUEzVBdW5hYfCuKfwOQnoRZCcN0_CBkUcXBFUXLZrUIaHrzZt9QZJ2jHIjbUI5W1fNy1H-loMcj4EEyCNoCvGohzu8fMG-quSAF3butiNp_Sqm_OHMhwDwJ7KNSsthTuRw-0B1Vt4GiUjSjE3dmGQ9coj4yQ9RP2kTUTosIo06biPpMrt_aONEp5oomErHhnTiwOm7CKS5wB_V3KaD-2ac575hRMeQt14fG1X_VjSVoi-6n9o')" }}></div>
              <div className="size-8 rounded-full border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHHOBLyS7tPSsi16N3N7adTb-8lBymW-bJjYkxk2ccwOqJQw4UwfFp9FSAwAUHeR5vXUyB2qxesoaNGN9XCyR1YyszVyx0F6tRJDkdHNvnusyMjBzpkHBIAPaY2RGJWaOIUtTrjXpn8iOpeXbuCS3U877Qz2GOiMN9Akr-oGNVQrn-M6CR8TYRQNUsBiMGht2nab6quqckjvaY-7G_NuxNfAzIvRLWbl9wAJXGESDXBVcAnaozH4SWG-LyJ9Hii-L86BE9tjtvGYc')" }}></div>
              <div className="size-8 rounded-full border-2 border-background-dark bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAuqBX-WgFwk-flTsUgM7zAHfaH-IN2CMmruALe1MGfW7qu3m330m-ZfeQzsyommbCCqKdztfKc8rr3QkPiRMyOr9XkHHVzyUOQZGXvCc12uRg6gpJVGyLIwn1iejsXcv-O3UFrJzUZDm79Xn8Htq_G_SaAYs1pjWoxQK9VGjrBew302DBZ86RbNFVDOlf-k9n6vRxrCnJp0zTsN3zPuPWhI19OAUCuPa2MbZyk55JsAurNM43zguJjStWBjuEqh0Mh9IGhqAmeoFw')" }}></div>
            </div>
            <p>12,402 players online now</p>
          </div>
          <p>© 2024 Hand Cricket Pro League</p>
        </footer>
      </div>
    </div>
  );
}
