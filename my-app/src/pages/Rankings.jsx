import React from 'react';
import { Link } from 'react-router-dom';

export default function Rankings() {
  return (
    <div className="bg-[#221610] text-[#f8ddd4] font-body min-h-screen selection:bg-primary py-12 selection:text-white overflow-x-hidden min-h-screen relative" 
      style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(236, 91, 19, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 91, 19, 0.05) 0%, transparent 50%)" }}>
      
      <main className="max-w-7xl mx-auto px-6 pt-2 pb-32 relative text-white">
        {/* Background Watermark */}
        <div className="absolute -right-72 top-28 text-[12rem] font-black opacity-[0.03] -rotate-348 select-none pointer-events-none uppercase font-headline leading-[0.8] text-[#ec5b13]">
          Leaderboard
        </div>

        {/* Section Header */}
        <div className="relative z-10 mb-12">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase font-headline text-[#f8ddd4] mb-4">
            Global <span className="text-[#ec5b13]">rankings</span>
          </h1>
          {/* Leaderboard Tabs */}
          <div className="flex flex-wrap gap-2 p-1 bg-[#261813] rounded-xl w-fit border border-[#5a4138]/20">
            <button className="px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs bg-[#ec5b13] text-white shadow-[0_0_15px_rgba(236,91,19,0.4)]">Highest Points</button>
            <button className="px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all">Team Scores</button>
            <button className="px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all">Individual</button>
            <button className="px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs text-white/40 hover:text-white hover:bg-white/5 transition-all">Friends</button>
          </div>
        </div>

        {/* Podium / Rank Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16 relative z-10">
          {/* Rank 2: Silver */}
          <div className="order-2 md:order-1 group">
            <div className="bg-[#2b1c17] border-b-4 border-slate-400 p-8 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[100px]">military_tech</span>
              </div>
              <div className="relative text-center md:text-left">
                <div className="w-20 h-20 bg-slate-400/20 rounded-xl mb-6 p-1 relative mx-auto md:mx-0">
                  <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALybfHJZs1y2MnuVoy7ufB9GW7NN0S4ultfIlvhV539XzO7IQMEDIbuKnHEF4zaiQCqoA_zPAqVbnRnR3gdzzm5H0nrkgRjQh1NY163ujvV4Df_nWOdN4owC_s95Fzk6OYdzJJas2z4FSEg0rTtJ0Wro67Xw0tJO7nsEMx5i2uxSK-Bsr6KuZ3ja9JmwnuExeE85-z8qUgjcMskPmz3J5yQtC7qwGkU4qcisBxfStKBLtmL7jEcR1vVG9i1Aqht-hc_c88TiLBsT0" alt="Silver rank player"/>
                  <div className="absolute -bottom-2 -right-2 bg-slate-400 text-background flex items-center justify-center font-black px-2 py-0.5 rounded text-sm italic text-[#221610]">2ND</div>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1 truncate">Shadow_Striker</h3>
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4">12,450 VOLTS</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-400 uppercase">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>+4 Positions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 1: Gold */}
          <div className="order-1 md:order-2 group">
            <div className="bg-[#362621] border-b-4 border-[#ec5b13] p-10 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-12px] shadow-[0_0_50px_rgba(236,91,19,0.15)] ring-1 ring-[#ec5b13]/20 text-center md:text-left">
              <div className="absolute -right-8 -top-8 text-[#ec5b13]/10 group-hover:text-[#ec5b13]/20 transition-all">
                <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div className="relative">
                <div className="w-28 h-28 bg-[#ec5b13]/20 rounded-xl mb-8 p-1.5 relative mx-auto md:mx-0">
                  <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5PIDfA1YEMIIieqrUyI4dsY4CufNjmSYKKD5s7E54NLrBSd2bHOdhAXUcHDvrZBAN7UIT5pInRi314LQeJf-8CLxoTReYueXyF8KhBbCtxwoTyimW6k4BFG_mPw4kXb7851MrfXGsEeGA-7u4esPE1ZJJmYI61oxfu50oan1ssMp-V-RDwCZf7NSPHU9AYClDlbrxv_bUJolqLrzixC8hv_7TWm2ScK_m48dLOXJVxs4wukNxEqWxM-PVi7zKgMuIPyx6GPVmS2s" alt="Gold rank player"/>
                  <div className="absolute -bottom-3 -right-3 bg-[#ec5b13] text-white flex items-center justify-center font-black px-4 py-1 rounded text-xl italic shadow-lg">1ST</div>
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 italic">VoltMaster_99</h3>
                <p className="text-[#ec5b13] font-black text-sm uppercase tracking-[0.2em] mb-6">15,890 VOLTS</p>
                <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-[#ec5b13] uppercase">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <span>Unstoppable Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rank 3: Bronze */}
          <div className="order-3 md:order-3 group">
            <div className="bg-[#2b1c17] border-b-4 border-amber-700 p-8 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[100px]">stars</span>
              </div>
              <div className="relative text-center md:text-left">
                <div className="w-20 h-20 bg-amber-700/20 rounded-xl mb-6 p-1 relative mx-auto md:mx-0">
                  <img className="w-full h-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfEbchekLqu_GwHOQTm87jAbjrILKPOPjRUOqDYuQ5CSXDRmV7oKKGR2unKMOvkOgwmAaRt5J-JevQXyd43jYFLiD1tcZ4Pn2oc6QFHx8YsJh8xAuPoCGn4171_ZdC_irG5dvpoLerKKVWAcaIVG2iPa066IYCe_tKk2svakjeMVR448wApqV1KSIPIqorJUGU8DW7ZLQKjDLJ9_NMBd7yR3vwp8K4564aJ4dH-Wna-qlz2HxKohqi_rvfGr-pEFi7-Fr4OlH23z4" alt="Bronze rank player"/>
                  <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white flex items-center justify-center font-black px-2 py-0.5 rounded text-sm italic">3RD</div>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1 truncate">FastFinger_X</h3>
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4">11,200 VOLTS</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-600 uppercase">
                  <span className="material-symbols-outlined text-sm">remove</span>
                  <span>Stable Rank</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="relative z-10 bg-[#2b1c17]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#5a4138]/10">
          <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 border-b border-[#5a4138]/20 font-bold text-white/30 text-xs uppercase tracking-[0.2em]">
            <div>Rank</div>
            <div>Contender</div>
            <div className="text-right">Voltage</div>
          </div>
          <div className="divide-y divide-[#5a4138]/20 bg-[#2b1c17]">
            {/* Row 4 */}
            <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 items-center hover:bg-white/5 transition-colors group">
              <div className="text-xl font-black italic text-white/40 group-hover:text-white transition-colors">#04</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#41312b] overflow-hidden p-0.5 border border-[#5a4138]/20">
                  <img className="w-full h-full object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiwmE7JKMDSpTYU0Nx4GuKNakksK88H4Gl93i8fvYkwn-g5QxWMG3keIoCSbwJAvfAdxWYGWc_TrTFul2D5_STZoT4vEe8yIBWmfaPsgTPWKxld80pnmU6tQZI2fxzJZkdishqUtXxQEp_KNDB_-E-vXfvRC9rKrqaXWHv7XpAKE--kLQdZs7QK3GgSO_P8Ga-z_K8V83YKUiwqpqiOWZfw3T2ZLA_W0MLXvPiYuZXBPkeaHgXSBJ_x8Id39HpXabi4zcyspbPtqk" alt="Player"/>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight text-[#f8ddd4]">Thunder_Cricket</h4>
                  <p className="text-[10px] text-white/30 uppercase font-black">Level 42 PRO</p>
                </div>
              </div>
              <div className="text-right font-black italic text-lg tracking-tighter text-[#f8ddd4]">9,845</div>
            </div>
            
            {/* Row 5 (Zebrano Tinted) */}
            <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 items-center bg-white/5 group">
              <div className="text-xl font-black italic text-white/40 group-hover:text-white transition-colors">#05</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#41312b] overflow-hidden p-0.5 border border-[#5a4138]/20">
                  <img className="w-full h-full object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgMvzzJu9Wus64iCqtDsti4kAD759mEfPZMn4ommCId0r6dlTUXJjaA8dZuq_R1xoRKjVQ7SMZPlRBe7KHMHZCIWf_F5pKT7oF87TTAejdmbbhUb1SnuXIdg4VwfpFm3zQaywUyDNGxVw8h8M8Td24O6j6-rcc6DyAQlrC7C1nFg_C7oDrWcdunDaJfZbKuL47BOo8grq7Hdh3dai552386I0Xaq0sxhIIp4mILY2XiBvtlR0j6vpjVEZ6agrA3h6bLKAbl42XjSM" alt="Player"/>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight text-[#f8ddd4]">Ghost_Batsman</h4>
                  <p className="text-[10px] text-white/30 uppercase font-black">Level 39 ELITE</p>
                </div>
              </div>
              <div className="text-right font-black italic text-lg tracking-tighter text-[#f8ddd4]">9,210</div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 items-center hover:bg-white/5 transition-colors group">
              <div className="text-xl font-black italic text-white/40 group-hover:text-white transition-colors">#06</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#41312b] overflow-hidden p-0.5 border border-[#5a4138]/20">
                  <img className="w-full h-full object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM0KMepsUDASNwQyth3Z-4uXLyGXCB3O0k0jZzYIKgAyjyIpXwls6Ftrm3MXgjRAJ69v_0PITMdyqDhG77G0_zg4Jzwp3hEgbWklbkGYiaxNKVDYggumT02vyEVq7EijPjRm6gHVZclS-ggjNwZ8OCQlnyXCj_woALBp3t1l2xUoD2QdqWJHEBJuqFLb23b4SgXLZgb_72TFf_bayxrDEPQ_orGj_FDFz0i6FJkAyKyvU_orbc9EE0XbRUQ_pLU2r-cl5xcoYidiw" alt="Player"/>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight text-[#f8ddd4]">Orange_Fury</h4>
                  <p className="text-[10px] text-white/30 uppercase font-black">Level 35 ACE</p>
                </div>
              </div>
              <div className="text-right font-black italic text-lg tracking-tighter text-[#f8ddd4]">8,760</div>
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 items-center hover:bg-white/5 transition-colors group">
              <div className="text-xl font-black italic text-white/40 group-hover:text-white transition-colors">#07</div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#41312b] overflow-hidden p-0.5 border border-[#5a4138]/20">
                  <img className="w-full h-full object-cover rounded-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp_V2yqRxPvARc5q0VsHtXsSv3WgvoDEe13lMbv48SVhbIZiPvHfBI-DHVJz3_ZEZR5IE9IFS2qJ9_LLfbOefJDkVNayEYCiw5xxUuc6VvbyawfY7eIU5cnoAN24TvDWx-nw14vVZkMubHHD75gjoIeaNhEirHRkE-oZpjmz5keIA8XNpKp8JVXXfyxMCHEXrVjc3hLIloRBXaqFfTdVhoIaXYQI-IDeYoy6CbXBhsVQ5hk2Tu385P32D34vXTdg5IGDx1rMCvFC0" alt="Player"/>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-tight text-[#f8ddd4]">Pixel_Puncher</h4>
                  <p className="text-[10px] text-white/30 uppercase font-black">Level 31 PRO</p>
                </div>
              </div>
              <div className="text-right font-black italic text-lg tracking-tighter text-[#f8ddd4]">8,400</div>
            </div>
          </div>
        </div>
      </main>

      {/* User's Fixed Rank Footer */}
      <div className="fixed bottom-16 md:bottom-0 left-0 w-full z-40 px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#ec5b13] p-1 rounded-2xl shadow-[0_-10px_40px_rgba(236,91,19,0.3)]">
            <div className="bg-[#261813] rounded-xl px-4 md:px-6 py-4 flex items-center justify-between border border-[#ec5b13]/20">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="text-2xl md:text-3xl font-black italic text-[#ec5b13]">#142</div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#ec5b13] overflow-hidden p-0.5">
                  <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHkeNSgzwrGNUs4yXPnY0XYQ3IDZthz8W9aYjB4mHEjJ6Qj63zlmAOYia7YhF2kN_UGjA4OGNIwedP_AEwo4eXXx0RizU60nm1HpdsYdBevrkKLWLAPXDdvYPjJwKy4zUXCvoQCSv-T8iNaUrZpBiwI4ktXMju2QmIpgWLruKU7OQ5np--_0c1N1xfbo5oHA-JcI7d0a_FVSrq5oif5-VqWureCWiN5gVqeM2iD8_hGlBFnVBQd_6c2VJp0omvbTPFXYlX7S3rhgg" alt="You"/>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-[#f8ddd4] text-base md:text-lg italic">YOUR POSITION</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#ec5b13] uppercase tracking-widest bg-[#ec5b13]/10 px-2 rounded mt-1">Legendary Rank</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-black tracking-tighter italic text-white">4,592</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CURRENT SCORE</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
