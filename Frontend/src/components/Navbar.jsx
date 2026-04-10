import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });

  const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
    const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
    return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/v1/users/current-user', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/v1/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      // console.log("Logout", response);
      if (!response.ok) {
        console.error('Logout failed on server:', await response.text());
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsLoggingOut(false);
      navigate('/login');
    }
  };
  
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 py-4 lg:px-20 bg-background-light dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className=" text-primary flex items-center justify-center">
          <img src={logo} alt="logo" className='pt-4 scale-150 w-[150px] h-[50px] object-cover'/>
        </Link>
      </div>
      
      <div className="flex flex-1 justify-end gap-4 items-center">
        <div className="hidden md:flex gap-4 mr-6">
          <Link 
            to="/lobby" 
            className={`${path === '/lobby' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'} font-medium transition-colors`}
          >
            Lobby
          </Link>
          {/* <button className="text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">
            Tournaments
          </button> */}
          <Link 
            to="/rankings" 
            className={`${path === '/rankings' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'} font-medium transition-colors`}
          >
            Rankings
          </Link>
          <Link 
            to="/guide" 
            className={`${path === '/guide' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'} font-medium transition-colors`}
          >
            Guide
          </Link>
        </div>
        
        {user ? (
          <>
            <div className="flex gap-4">
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined" onClick={() => navigate('/settings')}>settings</span>
              </button>
              <button 
                disabled={isLoggingOut}
                onClick={handleLogout} 
                title="Logout"
                className="flex items-center justify-center rounded-lg h-10 w-10 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
            
            <Link to={`/profile/${user.username}`} className={`h-10 w-10 rounded-full bg-primary border-2 ${path.startsWith('/profile') ? 'border-primary' : 'border-primary/30'} overflow-hidden cursor-pointer hover:border-primary transition-colors`}>
              <img alt="User Profile" className="w-full h-full object-cover" src={getAvatarUrl(user?.avatar)}/>
            </Link>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-bold uppercase tracking-wider text-xs">
              Login
            </Link>
            <Link to="/register" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white hover:bg-primary/90 transition-all font-bold uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(236,91,19,0.3)]">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
