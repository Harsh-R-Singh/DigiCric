import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      // Registration successful
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Basic GSAP animation following the previous style
    gsap.fromTo(".register-container", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center relative px-6 py-12 w-full h-full min-h-[calc(100vh-140px)]">
      {/* Kinetic Energy Watermarks */}
      <div className="absolute inset-0 overflow-hidden select-none z-0 pointer-events-none">
        <div className="text-[rgba(236,91,19,0.03)] opacity-50 absolute -top-10 -left-20 font-headline font-black text-[12rem] uppercase tracking-tighter" style={{ transform: "rotate(-12deg)" }}>DIGICRIC</div>
        <div className="text-[rgba(236,91,19,0.03)] opacity-50 absolute top-1/2 -right-40 font-headline font-black text-[15rem] uppercase tracking-tighter" style={{ transform: "rotate(-12deg)" }}>VOLT</div>
        <div className="text-[rgba(236,91,19,0.03)] opacity-50 absolute -bottom-20 left-1/4 font-headline font-black text-[10rem] uppercase tracking-tighter" style={{ transform: "rotate(-12deg)" }}>KINETIC</div>
      </div>
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ec5b13]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ec5b13]/5 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      {/* Registration Container */}
      <div className="w-full max-w-md z-10 register-container">
        <div className="bg-[#2b1c17]/60 backdrop-blur-xl border border-[#5a4138]/20 rounded-xl p-8 md:p-12 shadow-[0_0_50px_rgba(236,91,19,0.1)] relative overflow-hidden">
          
          {/* Branding Section */}
          <div className="flex flex-col items-center mb-10">
            <img alt="DigiCric Official Logo" className="h-20 w-auto mb-6 drop-shadow-[0_0_15px_rgba(236,91,19,0.4)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWGwadMdDTQLLZl8Tj8xG-AQX1GKTvnrv498s0tV_xn-8qEpyH0Q5VLp8GfxbBUoS-Z6iPsiw3xFLN5BMvXbh92olydj5j7Yn89PmkIPkSujiRJ5Q7cqH8LhmoAwdFugmLe4c6v_QRpZtmmtrpGGDoS8wxJDJDT3gZ8E2TdmDqtihBxN_XtANxRtPG9kduLZexxcHpZgUgbblx-UfBdSQxzziIZkl9LJwwIjZfwWD0iQakQbf99Ek6tiFRWHzrC9n_Lf9RszlFlv0" />
            <h1 className="font-headline text-4xl font-black uppercase tracking-tight text-[#f8ddd4] mb-2">JOIN THE VOLT</h1>
            <p className="font-label text-[#ec5b13] font-bold uppercase tracking-widest text-[10px]">Precision. Power. Performance.</p>
          </div>

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm py-3 px-4 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="font-label text-[12px] font-bold uppercase tracking-[0.05em] text-[#e2bfb3] block ml-1">USERNAME</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#ec5b13]/60 text-[20px]">person</span>
                <input 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-[#261813] border-0 border-b-2 border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-0 text-[#f8ddd4] placeholder:text-[#e2bfb3]/30 font-medium py-4 pl-12 pr-4 transition-all duration-300 outline-none" 
                  placeholder="CRIC_MASTER_99" 
                  type="text" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-[12px] font-bold uppercase tracking-[0.05em] text-[#e2bfb3] block ml-1">EMAIL ADDRESS</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#ec5b13]/60 text-[20px]">alternate_email</span>
                <input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#261813] border-0 border-b-2 border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-0 text-[#f8ddd4] placeholder:text-[#e2bfb3]/30 font-medium py-4 pl-12 pr-4 transition-all duration-300 outline-none" 
                  placeholder="PLAYER@DIGICRIC.GG" 
                  type="email" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-[12px] font-bold uppercase tracking-[0.05em] text-[#e2bfb3] block ml-1">PASSWORD</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#ec5b13]/60 text-[20px]">lock</span>
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-[#261813] border-0 border-b-2 border-[#5a4138]/30 focus:border-[#ec5b13] focus:ring-0 text-[#f8ddd4] placeholder:text-[#e2bfb3]/30 font-medium py-4 pl-12 pr-4 transition-all duration-300 outline-none" 
                  placeholder="••••••••••••" 
                  type="password" 
                  required
                />
              </div>
            </div>

            <button 
              className={`w-full bg-[#ec5b13] px-4 hover:bg-[#ec5b13]/90 text-white font-headline font-black text-lg py-5 rounded-lg transition-all duration-300 shadow-[0_0_25px_rgba(236,91,19,0.3)] hover:shadow-[0_0_40px_rgba(236,91,19,0.5)] active:scale-[0.98] uppercase tracking-wider mt-4 disabled:opacity-50 disabled:cursor-not-allowed`} 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Redirect Link */}
          <div className="mt-10 text-center">
            <p className="font-label text-[#e2bfb3] text-[14px]">
              ALREADY HAVE AN ACCOUNT? 
              <Link className="text-[#ec5b13] font-bold hover:underline transition-all ml-1" to="/login">LOGIN</Link>
            </p>
          </div>

          {/* Corner Accent */}
          <div className="absolute -bottom-1 -right-1 w-12 h-12 border-r-2 border-b-2 border-[#ec5b13]/40"></div>
          <div className="absolute -top-1 -left-1 w-12 h-12 border-l-2 border-t-2 border-[#ec5b13]/40"></div>
        </div>

        {/* Footer Small */}
        <div className="mt-8 flex justify-center gap-6">
          <a className="font-label text-[10px] text-[#e2bfb3]/40 hover:text-[#ec5b13] transition-colors" href="#">PRIVACY POLICY</a>
          <a className="font-label text-[10px] text-[#e2bfb3]/40 hover:text-[#ec5b13] transition-colors" href="#">TERMS OF SERVICE</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
