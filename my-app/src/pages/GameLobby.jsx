import React from 'react';
import { Link } from 'react-router-dom';

export default function GameLobby() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

          <main className="flex-1 px-6 py-8 lg:px-20 max-w-[1440px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              {/* Left Column: User Profile & Play Now */}
              <div className="md:col-span-1 lg:col-span-7 flex flex-col gap-8">
                {/* Profile Card */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="size-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-4xl overflow-hidden">
                      <img alt="Avatar" className="w-full h-full" data-alt="Avatar of the player with orange highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB99QwXJuXKj52iE71i_kWkbnCJgiQY7tu4K8tyHTwqx-nohdmAFJTmHDgsTyfd3yWxFiaC9rqLK1uQKfk_zdBenyLevMGCuPeuw0BFO0n-Z7apbYXV0v87JVxL8BZtsr-IyZ1UqmppYtcNnbLwC3xTz2WW2lrJ622GSv6dqo4__W2e-s7YqoNhGKqHTucEQBqoYLcNu2_0ztASizZn5nLRgWRMF-vSJS2zs-OalZC1h7QbqcCR05c08DpSgMJmcJz_kuXRf7IkK2Y"/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Shikhar_D</h3>
                      <p className="text-primary font-medium text-lg">Level 24 Elite</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mt-3">
                        <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Matches</p>
                      <p className="text-2xl font-bold text-primary">142</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Wins</p>
                      <p className="text-2xl font-bold text-primary">89</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">High Score</p>
                      <p className="text-2xl font-bold text-primary">214</p>
                    </div>
                  </div>
                </div>
                {/* Game Modes */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">sports_cricket</span>
                    Play Now
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/camera" className="group relative overflow-hidden bg-primary text-white rounded-xl p-8 transition-all hover:shadow-[0_0_25px_rgba(236,91,19,0.5)] flex flex-col justify-between min-h-[200px] text-left block">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Camera Mode</h3>
                        <p className="text-white/80 text-sm">Play using real hand gestures via your webcam</p>
                      </div>
                      <div className="flex justify-end relative z-10">
                        <span className="material-symbols-outlined text-5xl">photo_camera</span>
                      </div>
                      <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">CAM</div>
                    </Link>
                    <Link to="/game" className="group relative overflow-hidden bg-slate-800 dark:bg-slate-700 text-white rounded-xl p-8 transition-all hover:bg-slate-700 dark:hover:bg-slate-600 flex flex-col justify-between min-h-[200px] border border-slate-600 text-left block">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">VS Computer</h3>
                        <p className="text-slate-300 text-sm">Practice and sharpen your skills</p>
                      </div>
                      <div className="flex justify-end relative z-10">
                        <span className="material-symbols-outlined text-5xl">memory</span>
                      </div>
                      <div className="absolute -right-4 -bottom-4 text-white/5 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">CPU</div>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Right Column: Leaderboard */}
              <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Leaderboard</h2>
                  <Link to="/rankings" className="text-primary font-bold hover:underline">Full Rankings</Link>
                </div>
                <div className="bg-background-light dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-1">
                  <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800 h-full">
                    {/* Top 3 Style */}
                    <div className="flex items-center gap-4 p-6 bg-primary/5">
                      <span className="text-primary font-bold text-2xl w-8">1</span>
                      <div className="size-14 rounded-full border-2 border-primary overflow-hidden">
                        <img alt="Top Player" className="w-full h-full object-cover" data-alt="Avatar of the rank 1 player" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxDvJ13S30zW5ONCLaKr_0K6W_GsZcicYM4lmtgvGwP144r50Tc6EzKV9826peJKfUvc_bke0LrsbpnGtaEwKX8gSHI6dSY9nYe6H36NfscYXGqpyZRIYw4HjjGlHq71b5HBIAn7qeNzrUOv-rxQZWlEy2_kwcXixpt-caA-9irhDAb4uFCCCrwG1oML_1x81aYPdAGkuc-efHC7l3uC0yYND6vITzR4UhRhB6f9UVyHp7UJFW1NJ_3sYqpE9Q_WtV6GKyl0pO-Nk"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">CrickKing_99</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">4,850 Pts</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                    </div>
                    <div className="flex items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <span className="text-slate-500 font-bold text-2xl w-8">2</span>
                      <div className="size-14 rounded-full border-2 border-slate-300 dark:border-slate-600 overflow-hidden">
                        <img alt="Rank 2" className="w-full h-full object-cover" data-alt="Avatar of the rank 2 player" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmqpj06QISRWyGV89gH8R9HVxZOyZp4w_Qva9Szg6fv_KBV9zSaXR7wfBm032MKmctuDU9uc-7a2GEr5nNzEnkbFeqAiwRZvmPSIjJEwVSGpggc4Ish-UCcSOWOcDKtQdZ8p5LckmkY_JNzFsAyPjqrvLVhwoIgv_2ZRGtdOjNgeF23cZLhsVZYPw8dMfi20jQ1_vSSx-OLH8VqSSL37OtHDfA7wwU5VxGfzHZ02RRqdeb_1MhXox1vLuj8RMa-QtjXiwGdQJ8znA"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">MasterBlaster</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">4,620 Pts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <span className="text-slate-500 font-bold text-2xl w-8">3</span>
                      <div className="size-14 rounded-full border-2 border-slate-300 dark:border-slate-600 overflow-hidden">
                        <img alt="Rank 3" className="w-full h-full object-cover" data-alt="Avatar of the rank 3 player" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhvu8yQ_jSYzcLayZ8HCFmbgcsgExKP8xYQdp4ziTDZZZr21xTWXYrCpQ5QI3xb_RiiC4Dtzj330LnnjY1oqTLIjs2npL54ffyU_nkrwIJDYPzu52kTBuY7uIV5Yt3CBUFr2hqm_4VoxQoiDE5KFic98T3t7-0gY9UtHJKrMuMEHIev0N6cxS2IbdVmAZzflXIMBKdpJsHOQQADvC3q7oHKGhHRXgnjenA5bhwN_CHlEDurw7cBCC1LyksjeTffGfbRV5TrtIx5T8"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">GoatCricket</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">4,410 Pts</p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-4 p-6 bg-primary/10 border-t border-primary/20">
                      <span className="text-primary font-bold text-2xl w-8">12</span>
                      <div className="size-14 rounded-full border-2 border-primary/40 overflow-hidden">
                        <img alt="Your Rank" className="w-full h-full object-cover" data-alt="Avatar of the current player in the leaderboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjlNWhHKKtMkFR3FDg5bR51PkYVHbIOIc-vP5TkOykYgELSmm8Tg6G3dm3dEXukbB-qMq87wCf0MugxMhuZYVkggeMz9oR6yFsu8a3Rh1cRzeq9NcDkT-pT3fWSdfdlTd4gw0ZmwyifIvYDxfYyOgLIcRQFAlvIUQSkWWckrR87dErnJJ_p9-qKW2bJMySiXMqKWjGpXoz06-MiDRiEuBOenudwD0Zh76xRcJwRwhSKTBta8M8a5LLkLsWgJgznyETNMLOHPxswG8"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">Shikhar_D (You)</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">3,120 Pts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {/* Footer Area */}
          <footer className="px-6 py-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-auto border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-4">
                <div className="size-6 text-primary/60">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                  </svg>
                </div>
                <p>© 2024 Hand Cricket Pro. All rights reserved.</p>
              </div>
              <div className="flex gap-8">
                <a className="hover:text-primary transition-colors font-medium" href="#">Terms of Service</a>
                <a className="hover:text-primary transition-colors font-medium" href="#">Privacy Policy</a>
                <a className="hover:text-primary transition-colors font-medium" href="#">Help Center</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
