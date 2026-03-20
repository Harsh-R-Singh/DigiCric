import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">


        <main className="flex-1 px-6 md:px-20 lg:px-40 py-10">
          <section className="flex flex-col gap-50 lg:flex-row items-center mb-16">
            <div className="flex flex-col gap-8 lg:w-1/2">
              <div className="flex flex-col gap-4">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">Nostalgia Reimagined</span>
                <h1 className="text-slate-900 dark:text-slate-100 text-5xl md:text-6xl font-black leading-tight tracking-tight">
                  The Ultimate Digital <span className="text-primary">Hand-Cricket</span> Battle
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg">
                  Experience the thrill of school-time hand cricket. Master the gestures, outsmart the bowler, and climb the global leaderboard.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/lobby" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold hover:brightness-110 shadow-xl shadow-primary/30 transition-all">
                  <span>Play Now</span>
                </Link>
                <Link to="/guide" className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary/10 border border-primary/20 text-primary text-lg font-bold hover:bg-primary/20 transition-all">
                  <span>How to Play</span>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-3xl overflow-hidden border border-primary/10 flex items-center justify-center">
                <img className="w-full h-full object-cover opacity-80 mix-blend-overlay" alt="Illustration of hand gestures showing cricket scores" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF-Fls_69vCv-pJJZdsTHrS6OhaYgkteYKF-oiEvnIbCHC-tXfdfReLafJe6h09iLu7y3UTU5E_aB8pSI1VQ-B1yCJ5-5fFutpSZxOQgEsErpmJwOQmGl88cocsGCSAqGCLUoPlT82KoENMfH53bkaA4GDiWFIH3pM3yqk7TfN14bY62H2SFIOuB_Di2TZ5L47tfoG6ISv6GSGqIu_ptDPNpoWAFDSl2pZfpFazECEwP9ZxD5Jo-plnfFdTI7YLu-yULNWsiQ7hTY" />
                <div className="absolute inset-0 flex items-center justify-center gap-8">
                  <span className="material-symbols-outlined text-8xl text-primary animate-pulse">pan_tool</span>
                  <span className="material-symbols-outlined text-8xl text-primary/50">back_hand</span>
                </div>
              </div>
            </div>
          </section>

          {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="flex flex-col gap-2 rounded-2xl p-8 bg-primary/5 border border-primary/10">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Active Players</p>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">50,000+</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl p-8 bg-primary/5 border border-primary/10">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Matches Today</p>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">1.2M</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl p-8 bg-primary/5 border border-primary/10">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">World Ranking</p>
              <p className="text-slate-900 dark:text-slate-100 text-4xl font-black">#1 Sports</p>
            </div>
          </section> */}

          <section className="py-16" id="how-to-play">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">The Mechanics</h2>
              <h3 className="text-slate-900 dark:text-slate-100 text-4xl font-black mb-6">Simple Rules, Infinite Strategy</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
                Hand cricket is a game of psychology. Predict your opponent's move while maximizing your own score.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-6 p-8 rounded-2xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 shadow-sm">
                <div className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">touch_app</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold">1. Pick a Number</h4>
                  <p className="text-slate-600 dark:text-slate-400">Choose any number from 1 to 6. Each number represents the runs you want to score in that delivery.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-2xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 shadow-sm">
                <div className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">compare_arrows</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold">2. The Comparison</h4>
                  <p className="text-slate-600 dark:text-slate-400">If your number matches the computer's or opponent's number, you're OUT! The innings ends immediately.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-8 rounded-2xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 shadow-sm">
                <div className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">scoreboard</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold">3. Score and Win</h4>
                  <p className="text-slate-600 dark:text-slate-400">If the numbers are different, you add your chosen number to your total score. Keep going until you get out!</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <span className="material-symbols-outlined text-[20rem]">sports_cricket</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to take the crease?</h2>
                <p className="text-white/90 text-lg max-w-xl">
                  Join thousands of players in real-time matches. Win tournaments, earn unique hand skins, and become the HandCricket Legend.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/lobby" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg">
                    Start Playing
                  </Link>
                  <Link to="/rankings" className="bg-primary/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary/30 transition-colors">
                    View Leaderboard
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        
      </div>
    </div>
  );
}
