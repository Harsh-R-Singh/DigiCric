import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 py-4 lg:px-20 bg-background-light dark:bg-background-dark sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className=" text-primary flex items-center justify-center">
          {/* <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
          </svg> */}
          <img src={logo} alt="logo" className='pt-4 scale-150 w-[150px] h-[50px] object-cover'/>
        </Link>
        {/* <Link to="/" className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-100">
          Hand Cricket Pro
        </Link> */}
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
        
        <div className="flex gap-4">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        
        <Link to="/profile" className={`h-10 w-10 rounded-full bg-primary border-2 ${path === '/profile' ? 'border-primary' : 'border-primary/30'} overflow-hidden cursor-pointer hover:border-primary transition-colors`}>
          <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC0M_QMZXHTOsoCBa7nVEec60s2sjZlL4O9ph9-EUIftmuEB4YGxYckk-ClH2HeGguKeKrC_lNbFhFRel-FXXrmo2DMnonWY7SkF_jl1gn9QBLQaoON8oysYGzRfgjof0E3LpFeokhzU_P-Adr301o3lbvqgHYF_ysT-e6hPF4YAozxTu1gTjuqIIq1vveZdR-FAm1esADZDuPN8zfLXcWdAm-q2YepEgQ1bHvtdWXzeXxl1UVutdSRrY1wUzdPjiXU_BUoi-ENU8"/>
        </Link>
      </div>
    </header>
  );
}
