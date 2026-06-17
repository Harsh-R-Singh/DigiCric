import React, { useState, useRef,useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export default function GameLobby() {
  const [selectedMode, setSelectedMode] = useState(null);
  const containerRef = useRef();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(null);
  
  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Step 1: Get the current user session
        const currentUserRes = await fetch(`${API_URL}/api/v1/users/current-user`, {
          credentials: 'include'
        });
        if (!currentUserRes.ok) {
           navigate('/login');
           return;
        }
        const currentUserData = await currentUserRes.json();
        setCurrentUser(currentUserData.data.username);
        const username = currentUserData.data.username;
        // Step 2: Get full profile including stats using the retrieved username
        const profileRes = await fetch(`${API_URL}/api/v1/users/profile/${username}`, {
          credentials: 'include'
        });
        if (!profileRes.ok) throw new Error('Failed to fetch user profile stats');
        const profileData = await profileRes.json();

        setUserProfile(profileData.data);

        // Step 3: Fetch Leaderboard data (Top 3 Volts)
        try {
          const leaderboardRes = await fetch(`${API_URL}/api/v1/rankings/leaderboard?type=volts`, {
            credentials: 'include'
          });
          if (leaderboardRes.ok) {
            const leaderboardData = await leaderboardRes.json();
            setLeaderboard(leaderboardData.data.leaderboard || []);
            setUserRank(leaderboardData.data.userRank);
            setUserScore(leaderboardData.data.userScore);
          }
        } catch (lbErr) {
          console.error("Failed to fetch leaderboard", lbErr);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load user profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

          <main className="flex-1 px-6 py-8 lg:px-20 max-w-[1440px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              {/* Left Column: User Profile & Play Now */}
              <div className="md:col-span-1 lg:col-span-7 flex flex-col gap-8">
                {/* Profile Card */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-8 animate-in">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="size-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-4xl overflow-hidden">
                      <img alt="Avatar" className="w-full h-full object-cover scale-120" data-alt="Avatar of the player with orange highlights" src={getAvatarUrl(userProfile?.avatar)}/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{userProfile?.username}</h3>
                      <p className="text-primary font-medium text-lg">Level {userProfile?.level ||1 } {userProfile?.rank?userProfile?.rank:"Newbie"}</p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mt-3">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(userProfile?.xp%1000)/1000*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Matches</p>
                      <p className="text-2xl font-bold text-primary">{userProfile?.matchesPlayed}</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">Wins</p>
                      <p className="text-2xl font-bold text-primary">{userProfile?.totalWins}</p>
                    </div>
                    <div className="bg-background-light dark:bg-background-dark/50 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">High Score</p>
                      <p className="text-2xl font-bold text-primary">{userProfile?.highestScore}</p>
                    </div>
                  </div>
                </div>
                {/* Game Modes */}
                <div className="flex flex-col gap-4 animate-in">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedMode && (
                      <button 
                        onClick={() => setSelectedMode(null)} 
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                      </button>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {!selectedMode && <span className="material-symbols-outlined text-primary">sports_cricket</span>}
                      {selectedMode ? 'Select Match Format' : 'Play Now'}
                    </h2>
                  </div>
                  
                  {!selectedMode ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button onClick={() => setSelectedMode('camera')} className="group relative overflow-hidden bg-primary text-white rounded-xl p-8 transition-all hover:shadow-[0_0_25px_rgba(236,91,19,0.5)] flex flex-col justify-between min-h-[200px] text-left block">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Camera Mode</h3>
                          <p className="text-white/80 text-sm">Play using real hand gestures via your webcam</p>
                        </div>
                        <div className="flex justify-end relative z-10">
                          <span className="material-symbols-outlined text-5xl">photo_camera</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">CAM</div>
                      </button>
                      <button onClick={() => setSelectedMode('classic')} className="group relative overflow-hidden bg-slate-800 dark:bg-slate-700 text-white rounded-xl p-8 transition-all hover:bg-slate-700 dark:hover:bg-slate-600 flex flex-col justify-between min-h-[200px] border border-slate-600 text-left block">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Classic Mode</h3>
                          <p className="text-slate-300 text-sm">Play using your mouse</p>
                        </div>
                        <div className="flex justify-end relative z-10">
                          <span className="material-symbols-outlined text-5xl">memory</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/5 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">CPU</div>
                      </button>
                      <Link to="/multiplayer" state={{userProfile, currentUser}} className="group relative overflow-hidden bg-purple-600 text-white rounded-xl p-8 transition-all hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] flex flex-col justify-between min-h-[200px] text-left block">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Play with a Friend</h3>
                          <p className="text-white/80 text-sm">Create or join a room to play with friends using camera or without camera</p>
                        </div>
                        <div className="flex justify-end relative z-10">
                          <span className="material-symbols-outlined text-5xl">people</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">PVP</div>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link to={`/${selectedMode === 'camera' ? 'camera' : 'classic'}`} state={{ gameMode: selectedMode, gameFormat: 'single_wicket' ,userProfile:userProfile,currentUser:currentUser}} className="group relative overflow-hidden bg-primary text-white rounded-xl p-8 transition-all hover:shadow-[0_0_25px_rgba(236,91,19,0.5)] flex flex-col justify-between min-h-[200px] text-left block">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">Single Wicket</h3>
                          <p className="text-white/80 text-sm">Quick play. One wicket to decide the game.</p>
                        </div>
                        <div className="flex justify-end relative z-10">
                          <span className="material-symbols-outlined text-5xl">sports</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">1W</div>
                      </Link>
                      <Link to={`/${selectedMode === 'camera' ? 'camera' : 'classic'}`} state={{ gameMode: selectedMode, gameFormat: '5_overs' ,userProfile:userProfile,currentUser:currentUser}} className="group relative overflow-hidden bg-slate-800 dark:bg-slate-700 text-white rounded-xl p-8 transition-all hover:bg-slate-700 dark:hover:bg-slate-600 flex flex-col justify-between min-h-[200px] border border-slate-600 text-left block">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">5 Overs</h3>
                          <p className="text-slate-300 text-sm">A longer format game. Strategize and score.</p>
                        </div>
                        <div className="flex justify-end relative z-10">
                          <span className="material-symbols-outlined text-5xl">scoreboard</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-white/5 text-9xl font-black rotate-12 select-none group-hover:scale-110 transition-transform">5V</div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {/* Right Column: Leaderboard */}
              <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-6 animate-in">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Leaderboard</h2>
                  <Link to="/rankings" className="text-primary font-bold hover:underline">Full Rankings</Link>
                </div>
                <div className="bg-background-light dark:bg-background-dark/30 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex-1">
                  <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-800 h-full">
                    {/* Top 3 Players */}
                    {leaderboard.slice(0, 5).map((player, index) => (
                      <div key={player._id} className={`flex items-center gap-4 p-6 ${index === 0 ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'}`}>
                        <span className={`${index === 0 ? 'text-primary' : 'text-slate-500'} font-bold text-2xl w-8`}>{index + 1}</span>
                        <div className={`size-14 rounded-full border-2 ${index === 0 ? 'border-primary' : 'border-slate-300 dark:border-slate-600'} overflow-hidden`}>
                          <img alt={`Rank ${index + 1}`} className="w-full h-full object-cover" src={getAvatarUrl(player.avatar)}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">{player.username}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{player.scoreValue} Volts</p>
                        </div>
                        {index === 0 && <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>}
                      </div>
                    ))}
                    
                    {/* Current User Rank */}
                    <div className="mt-auto flex items-center gap-4 p-6 bg-primary/10 border-t border-primary/20">
                      <span className="text-primary font-bold text-2xl w-8">{userRank || '-'}</span>
                      <div className="size-14 rounded-full border-2 border-primary/40 overflow-hidden">
                        <img alt="Your Rank" className="w-full h-full object-cover" src={getAvatarUrl(userProfile?.avatar)}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate text-slate-900 dark:text-slate-100">{userProfile?.username}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{userScore !== null ? userScore : (userProfile?.volts || 0)} Volts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
