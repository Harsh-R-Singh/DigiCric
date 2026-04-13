import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const containerRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Section state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('Avatar1');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  
  // Messaging
  const [accountMsg, setAccountMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [deleteMsg, setDeleteMsg] = useState({ type: '', text: '' });

  // Initial user fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/current-user`, { credentials: 'include' });
        if (!res.ok) {
          navigate('/login');
          return;
        }
        const data = await res.json();
        setUsername(data.data.username);
        setEmail(data.data.email);
        if (data.data.avatar) setAvatar(data.data.avatar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setAccountMsg({ type: '', text: '' });
    
    try {
      const res = await fetch(`${API_URL}/api/v1/users/update-account`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, avatar })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to update account details');
      setAccountMsg({ type: 'success', text: 'Account details updated successfully.' });
      navigate(`/profile/${username}`);
    } catch (err) {
      setAccountMsg({ type: 'error', text: err.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMsg({ type: '', text: '' });
    
    if (deleteConfirmation !== username) {
      setDeleteMsg({ type: 'error', text: 'Username does not match.' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/users/delete-account`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      
      if (!res.ok){
        throw new Error(data.message || 'Failed to delete account');
      }
      
      navigate('/login');
    } catch (err) {
      setDeleteMsg({ type: 'error', text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="bg-[#221610] min-h-screen flex items-center justify-center">
        <div className="text-[#ec5b13] font-bold uppercase tracking-widest animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#221610] text-[#f8ddd4] font-body min-h-screen pb-24 selection:bg-[#ec5b13] selection:text-white relative">
      <main className="relative pt-24 px-4 md:px-8 max-w-4xl mx-auto overflow-hidden">
        
        <div className="mb-10 animate-in">
          <button onClick={() => navigate(-1)} className="text-[#ec5b13] font-bold mb-4 flex items-center gap-2 hover:underline">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
          </button>
          <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white uppercase">Account Settings</h1>
          <p className="text-white/50 mt-2">Manage your profile, security, and account preferences.</p>
        </div>

        <div className="space-y-8">
          {/* Account Details */}
          <div className="bg-[#2b1c17] p-8 rounded-xl shadow-xl relative overflow-hidden animate-in">
            <h2 className="text-2xl font-black italic text-white mb-6 uppercase border-b-2 border-[#5a4138]/20 pb-4">Profile Information</h2>
            
            {accountMsg.text && (
              <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${accountMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {accountMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateAccount} className="space-y-6">
              <div>
                <label className="block text-white/40 text-xs font-bold uppercase mb-2">Select Avatar</label>
                <div className="flex flex-wrap gap-4 pb-4">
                  {Object.keys(avatarImages).map((path) => {
                     const avatarName = path.split('/').pop().split('.')[0];
                     const isSelected = avatar === avatarName;
                     return (
                       <div 
                         key={avatarName} 
                         onClick={() => setAvatar(avatarName)}
                         className={`w-20 h-20 flex-shrink-0 rounded-full overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-[#ec5b13] shadow-[0_0_15px_rgba(236,91,19,0.5)] scale-105' : 'border-[#1b100b] hover:border-[#ec5b13]/50'}`}
                       >
                         <img className="w-full h-full object-cover scale-120" src={avatarImages[path]} alt={avatarName} />
                       </div>
                     );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs font-bold uppercase mb-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full bg-[#1b100b] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ec5b13]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-bold uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-[#1b100b] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ec5b13]/50 transition-colors"
                />
              </div>
              <button type="submit" className="bg-[#ec5b13] text-white font-bold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_rgba(236,91,19,0.5)] transition-all active:scale-95 text-sm uppercase tracking-wider">
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-[#2b1c17] p-8 rounded-xl shadow-xl relative overflow-hidden animate-in">
            <h2 className="text-2xl font-black italic text-white mb-6 uppercase border-b-2 border-[#5a4138]/20 pb-4">Security</h2>
            
            {passwordMsg.text && (
              <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${passwordMsg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-white/40 text-xs font-bold uppercase mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full bg-[#1b100b] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ec5b13]/50 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/40 text-xs font-bold uppercase mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full bg-[#1b100b] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ec5b13]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs font-bold uppercase mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-[#1b100b] border border-[#5a4138]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ec5b13]/50 transition-colors"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#41312b] border border-[#5a4138]/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-[#46352f] transition-all active:scale-95 flex items-center gap-2 text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">lock</span> Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#2b1c17] p-8 rounded-xl shadow-xl relative overflow-hidden ring-1 ring-red-500/20 animate-in">
            <h2 className="text-2xl font-black italic text-red-500 mb-6 uppercase border-b-2 border-red-500/20 pb-4">Danger Zone</h2>
            
            {deleteMsg.text && (
              <div className={`mb-6 p-4 rounded-lg font-bold text-sm bg-red-500/10 text-red-500`}>
                {deleteMsg.text}
              </div>
            )}

            <div className="space-y-4">
              <p className="text-white/70 text-sm">
                Deleting your account is permanent. All your stats, match history, and profile data will be completely wiped from the database. This action cannot be undone.
              </p>
              
              <div className="mt-4">
                <label className="block text-white/40 text-xs font-bold uppercase mb-2">Type <span className="text-red-400">"{username}"</span> to confirm</label>
                <input 
                  type="text" 
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={username}
                  className="w-full md:w-1/2 bg-[#1b100b] border border-red-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== username}
                className={`mt-4 font-bold px-6 py-3 rounded-lg flex items-center gap-2 text-sm tracking-wider transition-all
                  ${deleteConfirmation === username 
                    ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95' 
                    : 'bg-[#41312b] text-white/30 cursor-not-allowed border border-[#5a4138]/30'
                  }`}
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span> Delete Account
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
