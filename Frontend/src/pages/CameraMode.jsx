import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CameraMode() {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col">


        <main className="flex-1 flex flex-col items-center justify-start p-4 lg:p-8 max-w-7xl mx-auto w-full gap-6">
          {/* Game Status Header */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-in">
            {/* Score Stats */}
            <div className="flex flex-wrap gap-3 order-2 md:order-1">
              <div className="flex-1 bg-white dark:bg-primary/5 border border-primary/10 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-primary uppercase tracking-tighter">Current Score</span>
                <span className="text-3xl font-bold">42 <span className="text-lg text-slate-500">/ 2</span></span>
              </div>
              <div className="flex-1 bg-white dark:bg-primary/5 border border-primary/10 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Target</span>
                <span className="text-3xl font-bold">120</span>
              </div>
            </div>
            {/* Game Instruction */}
            <div className="order-1 md:order-2 text-center py-2">
              <div className="inline-flex items-center gap-2 bg-primary px-6 py-2 rounded-full text-white font-bold animate-pulse shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">front_hand</span>
                <span>Show your hand now!</span>
              </div>
            </div>
            {/* Timer */}
            <div className="flex justify-end order-3">
              <div className="flex gap-2 bg-slate-900/10 dark:bg-primary/10 p-2 rounded-xl border border-primary/20">
                <div className="flex flex-col items-center px-3">
                  <span className="text-2xl font-bold text-primary">00</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Min</span>
                </div>
                <div className="text-2xl font-bold text-primary self-center">:</div>
                <div className="flex flex-col items-center px-3">
                  <span className="text-2xl font-bold text-primary">03</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Gameplay Arena */}
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 group animate-in">
            {/* Camera Feed Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <img alt="Live camera feed background" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUmSynQOqEcvdL1jqSZPTSUVQqbV8LJ0MHOF-ZlIL23r9U81f6_kbrniamV3Rbyul75B-IyaH7vomX7bTI65BZyPzsKc05UpMP1QvdFKgYOsP0LZ0esNiFSpx7wsqmnTDXnEw5C8im3H4z0XtcVmOlGLahoIMgNsZ177RIU96EHLdvQNat_vMRpCpLQkp0n-fnSHnjFptn1wPJXKEWGdcDq_AaDsDCgezamr_UGeDtC3zJ0rh1B-0SP5qTxj4sV01StFzwvn9FLSs"/>
              
              {/* AI Bounding Box UI */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64 md:w-80 md:h-80 border-2 border-dashed border-primary/80 rounded-3xl flex items-center justify-center">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded text-white text-xs font-bold whitespace-nowrap">
                    HAND DETECTED
                  </div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <span className="text-5xl font-black text-primary drop-shadow-md">4</span>
                    <span className="text-xs font-bold uppercase text-white/70 tracking-widest">Gesture Match</span>
                  </div>
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                </div>
              </div>
            </div>

            {/* Opponent Overlay (CPU) */}
            <div className="absolute bottom-6 right-6 w-32 h-40 md:w-48 md:h-60 bg-background-dark/90 backdrop-blur rounded-xl border border-primary/40 overflow-hidden shadow-2xl transition-transform hover:scale-105">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 bg-slate-800 relative">
                  <img alt="CPU Opponent Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIwyxKdiv3pdmlMQ5hpCvEaCu37Xaz4Is0IVK1ESiLlVwx77eDpDpx4EC47OBd4B2ChK8ETB4pkp-SBCrm0kmd0PkP7kSzAlbG-4B0uG1QuyHg3XSb9rFZ6BwFEAw5veGY8Ren1tkoyA8GLzw9DiM6GOB1jqU2VeDv8da-UZ8OEaOZWLn5wXDvDtVc7TiOMmNPytz08maC3CMZD7q8REemsejQi6SVWlEF24Zs71rt2yhWg3Lg1dJovU_xA9dsmN2CGANDY2i9bSQ"/>
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/80 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-tighter">
                    <span className="size-1.5 bg-white rounded-full animate-ping"></span> CPU Thinking
                  </div>
                </div>
                <div className="p-3 bg-primary text-white flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold opacity-80">CPU Played</span>
                  <span className="text-2xl font-black leading-none">6</span>
                </div>
              </div>
            </div>
            
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          </div>

          {/* Footer Controls & Indicators */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-10 animate-in">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Camera Status</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20">
                  <span className="material-symbols-outlined text-sm">videocam</span>
                  <span className="text-xs font-bold uppercase">Ready</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">AI Engine</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-sm">memory</span>
                  <span className="text-xs font-bold uppercase">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-2 transition-all active:scale-95">
                <span className="material-symbols-outlined">pause</span> PAUSE GAME
              </button>
              <Link to="/lobby" className="bg-slate-200 dark:bg-primary/10 hover:bg-slate-300 dark:hover:bg-primary/20 text-slate-700 dark:text-primary font-bold py-3 px-6 rounded-xl border border-primary/20 transition-all text-center block leading-loose">
                FORFEIT
              </Link>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div key={num} className="size-10 rounded-full border-2 border-background-dark bg-primary flex items-center justify-center text-white text-xs font-bold">{num}</div>
              ))}
              <div className="size-10 rounded-full border-2 border-background-dark bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold">+10</div>
            </div>
          </div>
        </main>

        {/* Floating Action Menu (Mobile Only) */}
        <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-2">
          <button className="size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-background-dark">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
