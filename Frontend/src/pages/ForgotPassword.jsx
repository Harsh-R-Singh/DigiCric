import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setMessage(data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(".forgot-container", 
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

      <div className="w-full max-w-[440px] z-10 forgot-container">
        <div className="bg-[#2b1c17]/40 backdrop-blur-xl border border-[#5a4138]/20 rounded-xl p-8 md:p-12 shadow-[0_0_50px_rgba(236,91,19,0.1)] relative overflow-hidden group">
          
          <div className="absolute -top-1 -right-1 w-24 h-24 bg-[#ec5b13]/20 blur-3xl rounded-full"></div>
          
          <div className="flex flex-col items-center mb-10">
            <h1 className="font-headline text-3xl font-bold tracking-tighter text-[#f8ddd4] uppercase mb-2 text-center">Reset Password</h1>
            <p className="text-[#e2bfb3] font-medium text-xs tracking-widest uppercase text-center">Enter your email to receive a reset link</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
            
            {message && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[12px] font-bold uppercase tracking-[0.05em] text-[#ec5b13]">Email Address</label>
              <div className="relative">
                <input 
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#41312b]/50 border border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-1 focus:ring-[#ec5b13] rounded-lg py-4 px-4 text-[#f8ddd4] placeholder:text-[#e2bfb3]/40 transition-all outline-none font-bold" 
                  placeholder="PLAYER@DIGICRIC.COM" 
                  type="email" 
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                className={`w-full bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-headline font-black py-4 rounded-lg uppercase tracking-widest text-lg transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(236,91,19,0.3)] hover:shadow-[0_0_35px_rgba(236,91,19,0.5)] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed`} 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <Link className="text-[#ec5b13] font-bold text-[12px] uppercase tracking-wider hover:underline underline-offset-4 transition-all" to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
