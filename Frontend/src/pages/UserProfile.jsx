import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};

const API_URL = import.meta.env.VITE_API_URL;

export default function UserProfile() {
  const containerRef = useRef();
  const navigate = useNavigate();
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Step 1: Check if user is authenticated
        const currentUserRes = await fetch(`${API_URL}/api/v1/users/current-user`, {
          credentials: 'include'
        });
        if (!currentUserRes.ok) {
           navigate('/login');
           return;
        }
        const currentUserData = await currentUserRes.json();
        setIsOwnProfile(currentUserData.data.username === username);

        // Step 2: Get full profile including stats using the param username
        const profileRes = await fetch(`${API_URL}/api/v1/users/profile/${username}`, {
          credentials: 'include'
        });
        if (!profileRes.ok) throw new Error('Failed to fetch user profile stats');
        const profileData = await profileRes.json();
        
        setUserProfile(profileData.data);
      } catch (err) {
        console.error(err);
        setError('Could not load user profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const getFireClass = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'legend': return 'anim-fire-legend';
      case 'master': return 'anim-fire-master';
      case 'pro': return 'anim-fire-pro';
      case 'intermediate': return 'anim-fire-intermediate';
      case 'newbie': return 'anim-fire-newbie text-[#f8ddd4]/80';
      default: return 'anim-fire-newbie text-[#f8ddd4]/80';
    }
  };
  console.log(userProfile);
  return (
    <div ref={containerRef} className="bg-[#221610] text-[#f8ddd4] font-body min-h-screen pb-24 selection:bg-[#ec5b13] selection:text-white relative">
      <main className="relative pt-12 px-4 md:px-8 max-w-8xl mx-40 overflow-hidden">
        {/* Background Decorative Watermark */}
        <div className="absolute top-20 -left-20 z-0 pointer-events-none whitespace-nowrap text-[8rem] leading-none font-black text-[#ec5b13]/[0.05] -rotate-12 select-none">PRO PLAYER</div>
        <div className="absolute bottom-40 -right-20 z-0 pointer-events-none whitespace-nowrap text-[8rem] leading-none font-black text-[#ec5b13]/[0.05] -rotate-12 select-none">
          {userProfile?.username || 'VOLT'}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-[#ec5b13] font-bold uppercase tracking-widest animate-pulse">
            Loading player data...
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500 font-bold uppercase tracking-widest bg-red-500/10 rounded-xl">
            {error}
          </div>
        ) : (
          <>
            {/* User Overview & Hero */}
        <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-6 flex flex-col md:flex-row items-center md:items-start gap-8 bg-[#2b1c17] p-8 rounded-xl shadow-xl relative overflow-hidden group animate-in">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec5b13]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#ec5b13]/10 transition-colors"></div>
            <div className="relative">
              <div className="w-40 h-40 rounded-full scale-120 overflow-hidden border-4 border-[#ec5b13] shadow-[0_0_25px_rgba(236,91,19,0.3)] bg-black/50">
                <img className="w-full h-full object-cover scale-120" src={getAvatarUrl(userProfile?.avatar)} alt="Portrait"/>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ec5b13] text-white font-black px-3 py-1 rounded-lg text-sm italic">LVL {userProfile?.level|| 1}</div>
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left text-white">
              <div>
                <span className="text-[#ec5b13] uppercase tracking-[0.2em] font-bold text-xs">{userProfile?.rank}</span>
                <h1 className={`text-4xl md:text-6xl font-black italic tracking-tighter leading-none break-all py-2`}>{userProfile?.username}</h1>
                <div className="flex justify-between">
                  <p>Lvl {userProfile?.level}</p>
                  <p>Lvl {userProfile?.level+1}</p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full ">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(userProfile?.volts%3000)/3000*100}%` }}></div>
                </div>
                
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {isOwnProfile && (
                  <>
                    <button onClick={() => navigate('/settings')} className="bg-[#ec5b13] text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(236,91,19,0.5)] transition-all active:scale-95">
                      <span className="material-symbols-outlined text-sm">edit</span> EDIT PROFILE
                    </button>
                    <button onClick={() => navigate('/settings')} className="bg-[#41312b] border border-[#5a4138]/30 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#46352f] transition-all active:scale-95">
                      <span className="material-symbols-outlined text-sm">lock</span> SECURITY
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Quick View */}
          <div className="lg:col-span-6 grid grid-cols-4 gap-4 animate-in">
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Total Matches</span>
              <span className="text-4xl font-black text-white italic">{userProfile?.matchesPlayed || 0}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Wins</span>
              <span className="text-4xl font-black text-[#ec5b13] italic">{userProfile?.totalWins || 0}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Losses</span>
              <span className="text-4xl font-black text-white italic">{userProfile?.totalLosses || 0}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Win Rate</span>
              <span className="text-4xl font-black text-[#ec5b13] italic">
                {userProfile?.matchesPlayed ? Math.round((userProfile.totalWins / userProfile.matchesPlayed) * 100) : 0}%
              </span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Total Runs Scored</span>
              <span className="text-4xl font-black text-white italic">{userProfile?.totalRunsScored || 0}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Highest Score</span>
              <span className="text-4xl font-black text-white italic">{userProfile?.highestScore || 0}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Net Run Rate</span>
              <span className="text-4xl font-black text-white italic">{(userProfile?.netRunRate || 0).toFixed(3)}</span>
            </div>
            <div className="bg-[#2b1c17] p-6 rounded-xl flex flex-col justify-between border-b-4 border-[#ec5b13]/20">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Volts</span>
              <span className="text-4xl font-black text-white italic">{userProfile?.volts || 0}</span>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Left Column: Account & Performance */}
          <div className="lg:col-span-8 space-y-8 animate-in ">
            {/* Performance Trend */}
            <div className="bg-[#2b1c17] p-8 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-end mb-8 border-b border-[#5a4138]/20 pb-4">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tight text-white">PERFORMANCE TREND</h2>
                  <p className="text-white/50 text-sm">Score progression over last 10 games</p>
                </div>
                <span className="text-[#ec5b13] font-bold text-sm bg-[#ec5b13]/10 px-3 py-1 rounded-full blur-[2px]">+12.4% vs Last Week</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2 px-2 blur-[2px]">
                {[40, 65, 55, 80, 95, 45, 70, 60, 85, 90].map((h, i) => (
                  <div key={i} className={`w-full rounded-t-sm transition-all duration-300 ${h >= 90 ? 'bg-[#ec5b13] shadow-[0_0_15px_rgba(236,91,19,0.3)]' : 'bg-[#41312b] hover:bg-[#ec5b13]'}`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-white/30 font-bold uppercase tracking-widest blur-[2px]">
                <span>Game 1</span>
                <span>Game 10</span>
              </div>
            </div>

            {/* Recent Match History */}
            <div className="bg-[#2b1c17] rounded-xl overflow-hidden text-white">
              <div className="p-8 pb-4">
                <h2 className="text-2xl font-black italic tracking-tight uppercase">Recent Match History</h2>
              </div>
              <div className="divide-y divide-[#5a4138]/10 blur-[2px]">
                <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center font-black italic">WIN</div>
                    <div>
                      <div className="font-bold text-white text-lg">142 - 128</div>
                      <div className="text-white/50 text-sm">VS Computer • 5 Overs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-sm font-medium">2 hours ago</div>
                    <span className="material-symbols-outlined text-white/20 group-hover:text-[#ec5b13] transition-colors">chevron_right</span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center font-black italic">LOSS</div>
                    <div>
                      <div className="font-bold text-white text-lg">110 - 114</div>
                      <div className="text-white/50 text-sm">Camera Mode • 2 Overs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-sm font-medium">Yesterday</div>
                    <span className="material-symbols-outlined text-white/20 group-hover:text-[#ec5b13] transition-colors">chevron_right</span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center font-black italic">WIN</div>
                    <div>
                      <div className="font-bold text-white text-lg">186 - 140</div>
                      <div className="text-white/50 text-sm">VS Computer • 5 Overs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-sm font-medium">2 days ago</div>
                    <span className="material-symbols-outlined text-white/20 group-hover:text-[#ec5b13] transition-colors">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Account & Achievements */}
          <div className="lg:col-span-4 space-y-8 animate-in">
            <div className="bg-[#2b1c17] p-8 rounded-xl border border-[#5a4138]/10 text-white">
              <h3 className="text-sm font-bold text-[#ec5b13] uppercase tracking-widest mb-6">Account Details</h3>
              <div className="space-y-6 ">
                <div className='flex flex-row items-center'>
                  <label className="text-white/40 text-xs font-bold uppercase">Email Address : </label>
                  <p className="text-white text-sm ml-2">{userProfile?.email}</p>
                </div>
                <div className='flex flex-row items-center'>
                  <label className="text-white/40 text-xs font-bold uppercase">Member since : </label>
                  <p className="text-white text-sm ml-2 ">{new Date(userProfile?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                {/* <div>
                  <label className="text-white/40 text-xs font-bold uppercase">Connected Platforms</label>
                  <div className="flex gap-4 mt-3">
                    <div className="w-10 h-10 rounded-lg bg-[#41312b] flex items-center justify-center text-[#ec5b13] border border-[#ec5b13]/20">
                      <span className="material-symbols-outlined">google</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#41312b] flex items-center justify-center text-white/30 border border-[#5a4138]/20 grayscale">
                      <span className="material-symbols-outlined">chat</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="bg-[#2b1c17] p-8 rounded-xl text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-[#ec5b13] uppercase tracking-widest">Achievements</h3>
                <span className="text-xs font-bold text-white/50">12 / 24</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square rounded-xl bg-[#41312b] flex flex-col items-center justify-center p-2 text-center group cursor-pointer border border-[#ec5b13]/30 shadow-[0_0_10px_rgba(236,91,19,0.1)]">
                  <span className="material-symbols-outlined text-[#ec5b13] text-3xl mb-1 group-hover:scale-110 transition-transform">social_leaderboard</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">Century Maker</span>
                </div>
                <div className="aspect-square rounded-xl bg-[#41312b] flex flex-col items-center justify-center p-2 text-center group cursor-pointer border border-[#ec5b13]/30 shadow-[0_0_10px_rgba(236,91,19,0.1)]">
                  <span className="material-symbols-outlined text-[#ec5b13] text-3xl mb-1 group-hover:scale-110 transition-transform">sports_cricket</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">5-Wicket Haul</span>
                </div>
                <div className="aspect-square rounded-xl bg-[#41312b] flex flex-col items-center justify-center p-2 text-center group cursor-pointer border border-[#ec5b13]/30 shadow-[0_0_10px_rgba(236,91,19,0.1)]">
                  <span className="material-symbols-outlined text-[#ec5b13] text-3xl mb-1 group-hover:scale-110 transition-transform">photo_camera</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">Camera Pro</span>
                </div>
                <div className="aspect-square rounded-xl bg-[#170b07] flex flex-col items-center justify-center p-2 text-center opacity-30">
                  <span className="material-symbols-outlined text-white text-3xl mb-1">lock</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">World Class</span>
                </div>
                <div className="aspect-square rounded-xl bg-[#170b07] flex flex-col items-center justify-center p-2 text-center opacity-30">
                  <span className="material-symbols-outlined text-white text-3xl mb-1">lock</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">Hat Trick</span>
                </div>
                <div className="aspect-square rounded-xl bg-[#170b07] flex flex-col items-center justify-center p-2 text-center opacity-30">
                  <span className="material-symbols-outlined text-white text-3xl mb-1">lock</span>
                  <span className="text-[9px] font-bold text-white leading-tight mt-1">Finisher</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 border border-[#5a4138]/30 rounded-lg text-xs font-black tracking-widest uppercase hover:bg-white/5 transition-all text-white/70 hover:text-white">View All Badges</button>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
