import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Login = () => {
  useEffect(() => {
    // Basic GSAP animation following the previous style
    gsap.fromTo(".login-container", 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center px-4 relative z-10 w-full min-h-[calc(100vh-140px)]">
      
      {/* Kinetic Background Watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 font-headline font-black text-[12rem] text-[rgba(236,91,19,0.05)] uppercase tracking-tighter" style={{ transform: "rotate(-12deg)" }}>
          DIGICRIC
        </div>
        <div className="absolute -bottom-20 -right-20 font-headline font-black text-[15rem] text-[rgba(236,91,19,0.05)] uppercase tracking-tighter" style={{ transform: "rotate(-12deg)" }}>
          VOLT
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-50" style={{ background: "radial-gradient(circle at 50% 50%, rgba(236, 91, 19, 0.15) 0%, transparent 70%)" }}></div>
      </div>

      <div className="w-full max-w-[440px] z-10 login-container">
        {/* Login Container */}
        <div className="bg-[#2b1c17]/40 backdrop-blur-xl border border-[#5a4138]/20 rounded-xl p-8 md:p-12 shadow-[0_0_50px_rgba(236,91,19,0.1)] relative overflow-hidden group">
          
          {/* Accent Glow */}
          <div className="absolute -top-1 -right-1 w-24 h-24 bg-[#ec5b13]/20 blur-3xl rounded-full"></div>
          
          {/* Brand Logo Prominent */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 mb-6 relative">
              <img alt="DigiCric Logo" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN5fQ8x6UYDpi-sR5wWUhzBCJrLCYgMWAYo7VHYWZ1jCJMF9x2ya3e7anJoAsYZNar9B8sql2nzL2HL6Ge1fx9_kKszfIiNvgFiBqHfvRvRhJEvk37U_-SzxhjdY4_hIfi6nUJmJPisQ-vsisHKfck2wQGcCxza2-LW48xvgriiiro9FVTRsQ7CBh2HRcXXV3zsVsduTCTUjB613wUsXn9pPo8YPEu0H_Yydzplu3Rb8OOL-b20PTEVOCAw-hyN3CWNMsEyNTxi4E" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-[#f8ddd4] uppercase mb-2">Login</h1>
            <p className="text-[#e2bfb3] font-medium text-sm tracking-widest uppercase">Precision &amp; Performance</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#ec5b13]">Email Address</label>
              <div className="relative">
                <input className="w-full bg-[#41312b]/50 border border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] rounded-lg py-4 px-4 text-[#f8ddd4] placeholder:text-[#e2bfb3]/40 transition-all outline-none font-bold" placeholder="PLAYER@DIGICRIC.COM" type="email" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#ec5b13]">Security Token</label>
                <a className="text-[10px] font-bold uppercase tracking-wider text-[#e2bfb3] hover:text-[#ec5b13] transition-colors" href="#">Forgot Password?</a>
              </div>
              <div className="relative">
                <input className="w-full bg-[#41312b]/50 border border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] rounded-lg py-4 px-4 text-[#f8ddd4] placeholder:text-[#e2bfb3]/40 transition-all outline-none font-bold" placeholder="••••••••••••" type="password" />
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-headline font-black py-5 rounded-lg uppercase tracking-widest text-lg transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(236,91,19,0.3)] hover:shadow-[0_0_35px_rgba(236,91,19,0.5)] flex items-center justify-center gap-3 group" type="button">
                Enter Arena
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">bolt</span>
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-[#e2bfb3] font-bold text-[12px] uppercase tracking-wider">
              Don't have an account? 
              <Link className="text-[#ec5b13] hover:underline underline-offset-4 ml-1 transition-all" to="/register">Register Now</Link>
            </p>
          </div>
        </div>

        {/* Meta Links */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#e2bfb3]/40">
          <a className="hover:text-[#ec5b13] transition-colors" href="#">Fair Play Policy</a>
          <span className="w-1 h-1 bg-[#5a4138]/40 rounded-full mt-1.5"></span>
          <a className="hover:text-[#ec5b13] transition-colors" href="#">Terms of Engagement</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
