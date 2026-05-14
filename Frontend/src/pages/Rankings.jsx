import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';

export default function Rankings() {
  const containerRef = useRef();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('xp');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useGSAP(() => {
    gsap.fromTo(".animate-in", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [loading, activeTab] });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/rankings/leaderboard?type=${activeTab}`, {
           credentials: 'include'
        });
        if (!res.ok) {
           if (res.status === 401) navigate('/login'); 
           return;
        }
        const data = await res.json();
        setLeaderboard(data.data.leaderboard);
        setUserRank(data.data.userRank);
        setUserScore(data.data.userScore);
        setUserName(data.data.leaderboard[data.data.userRank-1]?.username);
        // console.log(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeTab, navigate]);

  const tabs = [
    { id: 'xp', label: 'Highest XP' },
    { id: 'volts', label: 'Most Volts' },
    { id: 'wins', label: 'Most Wins' },
    { id: 'netRunRate', label: 'Highest NRR' },
  ];

  const valueLabelMap = {
    'xp': 'XP',
    'volts': 'VOLTS',
    'wins': 'WINS',
    'netRunRate': 'NRR'
  };

  const currentLabel = valueLabelMap[activeTab];

  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div ref={containerRef} className="bg-[#221610] text-[#f8ddd4] font-body min-h-screen selection:bg-primary py-12 selection:text-white overflow-x-hidden relative" 
      style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(236, 91, 19, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 91, 19, 0.05) 0%, transparent 50%)" }}>
      
      <main className="max-w-7xl mx-auto px-6 pt-2 pb-32 relative text-white">
        <div className="absolute -right-72 top-28 text-[12rem] font-black opacity-[0.03] -rotate-348 select-none pointer-events-none uppercase font-headline leading-[0.8] text-[#ec5b13]">
          Leaderboard
        </div>

        <div className="relative z-10 mb-12 animate-in pt-8">
          <h1 className=" text-5xl md:text-7xl font-black italic tracking-tighter select-none pointer-events-none uppercase font-headline text-[#f8ddd4] mb-4">
            Global <span className="text-[#ec5b13]">rankings</span>
          </h1>
          <div className="flex flex-wrap gap-2 p-1 bg-[#261813] rounded-xl w-fit select-none border border-[#5a4138]/20">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id ? 'bg-[#ec5b13] text-white shadow-[0_0_15px_rgba(236,91,19,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
             <div className="flex justify-center items-center py-32"><p className="text-primary animate-pulse text-2xl font-black italic uppercase">CALCULATING RANKS...</p></div>
        ) : (
          <>
          {(firstPlace || secondPlace || thirdPlace) && (
            <div className="grid grid-cols-1 select-none md:grid-cols-3 gap-8 items-end mb-16 relative z-10 animate-in">
              <div className="order-2 md:order-1 group">
                {secondPlace ? (
                  <Link to={`/profile/${secondPlace.username}`} className="block bg-[#2b1c17] border-b-4 border-slate-400 p-8 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-[100px]">military_tech</span>
                    </div>
                    <div className="relative text-center md:text-left">
                      <div className="w-20 h-20 bg-slate-400 rounded-xl mb-6 p-1 relative mx-auto md:mx-0">
                        <img className="w-full h-full object-cover rounded-lg" src={getAvatarUrl(secondPlace.avatar)} alt="Silver rank player"/>
                        <div className="absolute -bottom-2 -right-2 bg-slate-400 text-background flex items-center justify-center font-black px-2 py-0.5 rounded text-sm italic text-[#221610]">2ND</div>
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tight mb-1 truncate">{secondPlace.username}</h3>
                      <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4">{secondPlace.scoreValue} {currentLabel}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        <span className="bg-slate-400/20 px-2 rounded-sm text-slate-300">Level {secondPlace.level} - {secondPlace.rank}</span>
                      </div>
                    </div>
                  </Link>
                ) : <div className="h-48 border border-white/5 rounded-xl border-dashed opacity-50 flex items-center justify-center"><p className="text-white/20 font-bold">Unranked</p></div>}
              </div>

              <div className="order-1 md:order-2 group">
                {firstPlace && (
                  <Link to={`/profile/${firstPlace.username}`} className="block bg-[#362621] border-b-4 border-yellow-600 p-10 rounded-xl relative overflow-hidden transition-all duration-600 hover:translate-y-[-12px] shadow-[0_0_50px_rgba(236,91,19,0.15)] ring-1 ring-[#ec5b13]/20 text-center md:text-left">
                    <div className="absolute -right-8 -top-8 text-yellow-600/10 group-hover:text-yellow-600/20 transition-all">
                      <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>
                    <div className="relative">
                      <div className="w-28 h-28 bg-yellow-600 rounded-xl mb-8 p-1.5 relative mx-auto md:mx-0">
                        <img className="w-full h-full object-cover rounded-lg" src={getAvatarUrl(firstPlace.avatar)} alt="Gold rank player"/>
                        <div className="absolute -bottom-3 -right-3 bg-[#ec5b13] text-white flex items-center justify-center font-black px-4 py-1 rounded text-xl italic shadow-lg">1ST</div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 italic truncate">{firstPlace.username}</h3>
                      <p className="text-yellow-600 font-black text-sm uppercase tracking-[0.2em] mb-6">{firstPlace.scoreValue} {currentLabel}</p>
                      <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-yellow-600 uppercase">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        <span>Level {firstPlace.level} - {firstPlace.rank}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              <div className="order-3 md:order-3 group">
                {thirdPlace ? (
                  <Link to={`/profile/${thirdPlace.username}`} className="block bg-[#2b1c17] border-b-4 border-amber-700 p-8 rounded-xl relative overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-[100px]">stars</span>
                    </div>
                    <div className="relative text-center md:text-left">
                      <div className="w-20 h-20 bg-amber-700 rounded-xl mb-6 p-1 relative mx-auto md:mx-0">
                        <img className="w-full h-full object-cover rounded-lg" src={getAvatarUrl(thirdPlace.avatar)} alt="Bronze rank player"/>
                        <div className="absolute -bottom-2 -right-2 bg-amber-700 text-white flex items-center justify-center font-black px-2 py-0.5 rounded text-sm italic">3RD</div>
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-tight mb-1 truncate">{thirdPlace.username}</h3>
                      <p className="text-white/40 font-bold text-xs uppercase tracking-widest mb-4">{thirdPlace.scoreValue} {currentLabel}</p>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-amber-600 uppercase">
                        <span className="bg-amber-900/20 px-2 rounded-sm text-amber-600">Level {thirdPlace.level} - {thirdPlace.rank}</span>
                      </div>
                    </div>
                  </Link>
                ) : <div className="h-48 border border-white/5 rounded-xl border-dashed opacity-50 flex items-center justify-center"><p className="text-white/20 font-bold">Unranked</p></div>}
              </div>
            </div>
          )}

          {restOfLeaderboard.length > 0 && (
            <div className="relative z-10 bg-[#2b1c17]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#5a4138]/10 animate-in mb-8">
              <div className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 border-b border-[#5a4138]/20 font-bold text-white/30 text-xs uppercase tracking-[0.2em]">
                <div>Rank</div>
                <div>Contender</div>
                <div className="text-right">{currentLabel}</div>
              </div>
              <div className="divide-y divide-[#5a4138]/20 bg-[#2b1c17]">
                {restOfLeaderboard.map((item, index) => (
                  <Link to={`/profile/${item.username}`} key={item._id || index} className="grid grid-cols-[80px_1fr_120px] gap-4 px-8 py-6 items-center hover:bg-white/5 transition-colors group cursor-pointer block">
                    <div className="text-xl font-black italic text-white/40 group-hover:text-white transition-colors">#{(index + 4).toString().padStart(2, '0')}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#41312b] overflow-hidden p-0.5 border border-[#5a4138]/20">
                        <img className="w-full h-full object-cover rounded-md" src={getAvatarUrl(item.avatar)} alt="Player"/>
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-tight text-[#f8ddd4]">{item.username}</h4>
                        <p className="text-[10px] text-white/30 uppercase font-black">Level {item.level} {item.rank}</p>
                      </div>
                    </div>
                    <div className="text-right font-black italic text-lg tracking-tighter text-[#f8ddd4]">
                       {item.scoreValue}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          </>
        )}
      </main>

      {!loading && (userRank !== null && userScore !== null) && (
        <div className="fixed bottom-16 md:bottom-0 left-0 w-full z-40 px-6 py-4 md:py-6 animate-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#ec5b13] p-1 rounded-2xl shadow-[0_-10px_40px_rgba(236,91,19,0.3)]">
              <div className="bg-[#261813] rounded-xl px-4 md:px-6 py-4 flex items-center justify-between border border-[#ec5b13]/20">
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="text-2xl md:text-3xl font-black italic text-[#ec5b13]">#{userRank}</div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-[#f8ddd4] text-base md:text-lg italic">{userName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#ec5b13] uppercase tracking-widest bg-[#ec5b13]/10 px-2 rounded mt-1">Based on {currentLabel}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-black tracking-tighter italic text-white">{userScore}</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CURRENT {currentLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
