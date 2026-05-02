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

export default function Friends() {
  const containerRef = useRef();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useGSAP(() => {
    gsap.fromTo(".animate-in", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [loading, activeTab] });

  useEffect(() => {
    const fetchFriendsData = async () => {
      setLoading(true);
      try {
        const friendsRes = await fetch(`${API_URL}/api/v1/friends/friends`, {
           credentials: 'include'
        });
        if (friendsRes.status === 401) {
            navigate('/login');
            return;
        }
        
        const requestsRes = await fetch(`${API_URL}/api/v1/friends/friend-requests`, {
           credentials: 'include'
        });

        if (friendsRes.ok) {
            const friendsData = await friendsRes.json();
            setFriends(friendsData.data || []);
        }
        
        if (requestsRes.ok) {
            const requestsData = await requestsRes.json();
            setRequests(requestsData.data || []);
        }
      } catch (err) {
        console.error("Error fetching friends data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendsData();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/users/search?query=${encodeURIComponent(searchQuery)}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (username) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/friends/friend-request/accept/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        // Move from requests to friends list (optimistic update)
        const acceptedUser = requests.find(r => r.username === username);
        if (acceptedUser) {
            setRequests(prev => prev.filter(r => r.username !== username));
            setFriends(prev => [...prev, acceptedUser]);
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Could not accept friend request');
      }
    } catch (err) {
      alert('Error accepting friend request');
    }
  };

  const handleRejectRequest = async (username) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/friends/friend-request/reject/${username}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.username !== username));
      } else {
        const data = await res.json();
        alert(data.message || 'Could not reject friend request');
      }
    } catch (err) {
      alert('Error rejecting friend request');
    }
  };

  const handleRemoveFriend = async (username) => {
    if (!window.confirm(`Are you sure you want to remove ${username} from your friends?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/api/v1/friends/friend/${username}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setFriends(prev => prev.filter(f => f.username !== username));
      } else {
        const data = await res.json();
        alert(data.message || 'Could not remove friend');
      }
    } catch (err) {
      alert('Error removing friend');
    }
  };

  const renderUserCard = (user, isRequest, isSearch = false) => (
    <div key={user._id} className="bg-[#2b1c17] rounded-xl overflow-hidden border border-[#5a4138]/20 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center p-6 gap-6 group">
      <Link to={`/profile/${user.username}`} className="flex items-center gap-6 flex-1 w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#41312b] rounded-xl p-1 shrink-0">
          <img className="w-full h-full object-cover rounded-lg" src={getAvatarUrl(user.avatar)} alt={user.username}/>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#f8ddd4] group-hover:text-[#ec5b13] transition-colors">{user.username}</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Level {user.level}</span>
             <span className="text-[10px] sm:text-xs font-bold text-[#ec5b13] uppercase tracking-widest bg-[#ec5b13]/10 px-2 py-0.5 rounded">{user.rank}</span>
          </div>
        </div>
      </Link>
      <div className="flex gap-2 sm:gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 justify-end">
        {isSearch ? (
            <Link to={`/profile/${user.username}`} className="bg-[#ec5b13]/10 text-[#ec5b13] hover:bg-[#ec5b13] hover:text-white border border-[#ec5b13]/30 px-4 py-2 rounded-lg flex items-center justify-center transition-all w-full sm:w-auto font-bold text-xs uppercase tracking-widest">
                View Profile
            </Link>
        ) : isRequest ? (
            <>
                <button onClick={() => handleAcceptRequest(user.username)} className="bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border border-green-500/50 p-2 sm:p-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex-1 sm:flex-none">
                    <span className="material-symbols-outlined text-sm sm:text-base">check</span>
                </button>
                <button onClick={() => handleRejectRequest(user.username)} className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/50 p-2 sm:p-3 rounded-lg flex items-center justify-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] flex-1 sm:flex-none">
                    <span className="material-symbols-outlined text-sm sm:text-base">close</span>
                </button>
            </>
        ) : (
            <button onClick={() => handleRemoveFriend(user.username)} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 p-2 sm:p-3 rounded-lg flex items-center justify-center transition-all w-full sm:w-auto group/remove">
                <span className="material-symbols-outlined text-sm sm:text-base group-hover/remove:hidden">person_remove</span>
                <span className="hidden group-hover/remove:block text-xs font-bold uppercase tracking-widest px-2">Remove</span>
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="bg-[#221610] text-[#f8ddd4] font-body min-h-screen selection:bg-primary py-12 selection:text-white overflow-x-hidden relative" 
      style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(236, 91, 19, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 91, 19, 0.05) 0%, transparent 50%)" }}>
      
      <main className="max-w-4xl mx-auto px-6 pt-2 pb-32 relative text-white">
        <div className="absolute -right-72 top-28 text-[12rem] font-black opacity-[0.03] -rotate-348 select-none pointer-events-none uppercase font-headline leading-[0.8] text-[#ec5b13]">
          Social
        </div>

        <div className="relative z-10 mb-12 animate-in pt-8">
          <h1 className=" text-5xl md:text-7xl font-black italic tracking-tighter select-none pointer-events-none uppercase font-headline text-[#f8ddd4] mb-4">
            My <span className="text-[#ec5b13]">Friends</span>
          </h1>
          <div className="flex flex-wrap gap-2 p-1 bg-[#261813] rounded-xl w-fit select-none border border-[#5a4138]/20">
            <button 
                onClick={() => setActiveTab('friends')}
                className={`px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${activeTab === 'friends' ? 'bg-[#ec5b13] text-white shadow-[0_0_15px_rgba(236,91,19,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-sm">group</span>
                Friends ({friends.length})
            </button>
            <button 
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-[#ec5b13] text-white shadow-[0_0_15px_rgba(236,91,19,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Requests {requests.length > 0 && <span className="bg-white text-[#ec5b13] px-1.5 py-0.5 rounded-full text-[10px] ml-1">{requests.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab('search')}
                className={`px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${activeTab === 'search' ? 'bg-[#ec5b13] text-white shadow-[0_0_15px_rgba(236,91,19,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-sm">search</span>
                Find Players
            </button>
          </div>
        </div>

        {loading && activeTab !== 'search' ? (
             <div className="flex justify-center items-center py-32"><p className="text-primary animate-pulse text-2xl font-black italic uppercase">FETCHING DATA...</p></div>
        ) : (
          <div className="space-y-4 animate-in relative z-10">
              {activeTab === 'search' && (
                  <div className="mb-6">
                      <form onSubmit={handleSearch} className="flex gap-2">
                          <input 
                              type="text" 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search by username..." 
                              className="w-full bg-[#2b1c17] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white outline-none focus:border-[#ec5b13]/50 transition-colors"
                          />
                          <button type="submit" disabled={loading} className="bg-[#ec5b13] hover:bg-[#ec5b13]/80 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50">
                              <span className="material-symbols-outlined">{loading ? "hourglass_empty" : "search"}</span>
                          </button>
                      </form>
                  </div>
              )}

              {activeTab === 'search' ? (
                  searchResults.length > 0 ? (
                      searchResults.map(user => renderUserCard(user, false, true))
                  ) : searchQuery && !loading ? (
                      <div className="text-center py-10 text-white/40">No players found</div>
                  ) : !loading ? (
                      <div className="text-center py-10 text-white/40">Search for players to view their profiles</div>
                  ) : null
              ) : activeTab === 'friends' ? (
                  friends.length > 0 ? (
                      friends.map(user => renderUserCard(user, false))
                  ) : (
                      <div className="text-center py-20 bg-[#2b1c17]/50 rounded-2xl border border-white/5 border-dashed">
                          <span className="material-symbols-outlined text-[60px] text-white/10 mb-4">sentiment_dissatisfied</span>
                          <p className="text-white/40 font-bold uppercase tracking-widest">No friends yet</p>
                          <button onClick={() => setActiveTab('search')} className="mt-6 bg-[#41312b] hover:bg-[#5a4138] text-white font-bold px-6 py-2 rounded-lg transition-colors text-sm uppercase tracking-widest">Find Players</button>
                      </div>
                  )
              ) : (
                  requests.length > 0 ? (
                      requests.map(user => renderUserCard(user, true))
                  ) : (
                      <div className="text-center py-20 bg-[#2b1c17]/50 rounded-2xl border border-white/5 border-dashed">
                          <span className="material-symbols-outlined text-[60px] text-white/10 mb-4">mail</span>
                          <p className="text-white/40 font-bold uppercase tracking-widest">No pending requests</p>
                      </div>
                  )
              )}
          </div>
        )}
      </main>
    </div>
  );
}
