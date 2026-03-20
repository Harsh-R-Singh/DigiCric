import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="w-full bg-background-light dark:bg-background-dark border-t border-solid border-primary/20 py-8 px-6 lg:px-20 mt-auto">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            <img src={logo} alt="logo" className='scale-115 w-[150px] h-[50px] object-cover'/>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left">
            The ultimate hand cricket digital experience.
          </p>
        </div>
        
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/guide" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            Guide
          </Link>
          <a href="mailto:harshrajsingh246@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            Contact Us
          </a>
          <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center items-center text-xs text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} DigiCric. All rights reserved.</p>
      </div>
    </footer>
  );
}
