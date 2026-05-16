import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:8000';
const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};
export default function MultiplayerLobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const userProfile = location.state?.userProfile;

  const [roomId, setRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('idle');
  const [gameFormat, setGameFormat] = useState('single_wicket');
  const [inputMethod, setInputMethod] = useState('camera');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const newSocket = io(API_URL, {
      withCredentials: true
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("roomCreated", (data) => {
      setCreatedRoomId(data.roomId);
      setStatus('waiting');
    });

    newSocket.on("gameStarted", (data) => {
      // Both players are in the room, navigate to game
      const route = data.gameState.inputMethod === 'camera' ? '/multiplayer/play' : '/multiplayer/classic';
      navigate(route, {
        state: {
          roomId: data.gameState.roomId,
          gameState: data.gameState,
          currentUser,
          userProfile,
          avatar:data.avatar,
          inputMethod: data.gameState.inputMethod//new
        }
      });
    });

    newSocket.on("roomError", (err) => {
      alert(err);
      setStatus('idle');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser, navigate, userProfile]);

  const handleCreateRoom = () => {
    if (!socket) return;
    setStatus('creating');
    socket.emit("createRoom", { username: currentUser,avatar:userProfile?.avatar, gameFormat,inputMethod});
  };

  const handleJoinRoom = () => {
    if (!socket || !roomId) return;
    setStatus('joining');
    socket.emit("joinRoom", { roomId, username: currentUser,avatar:userProfile?.avatar});
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 p-8 flex flex-col items-center pt-24">
      <h1 className="text-4xl font-bold font-display mb-8 text-primary">Play with a Friend</h1>
      
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 max-w-md w-full shadow-lg">
        {status === 'idle' || status === 'creating' || status === 'joining' ? (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Select Format</label>
              <select 
                value={gameFormat} 
                onChange={(e) => setGameFormat(e.target.value)}
                className="w-full bg-background-light dark:bg-background-dark border border-slate-600 rounded p-2 focus:border-primary focus:outline-none"
              >
                <option value="single_wicket">Single Wicket</option>
                <option value="5_overs">5 Overs</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Input Method</label>
              <select 
                value={inputMethod} 
                onChange={(e) => setInputMethod(e.target.value)}
                className="w-full bg-background-light dark:bg-background-dark border border-slate-600 rounded p-2 focus:border-primary focus:outline-none"
              >
                <option value="camera">Camera</option>
                <option value="classic">Classic (Buttons)</option>
              </select>
            </div>
            
            <button 
              onClick={handleCreateRoom}
              disabled={status !== 'idle'}
              className="bg-primary text-white font-bold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(236,91,19,0.5)] transition-all disabled:opacity-50"
            >
              {status === 'creating' ? 'Creating...' : 'Create Room'}
            </button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 border-t border-slate-600"></div>
              <span className="text-slate-500 font-bold uppercase text-xs">OR</span>
              <div className="flex-1 border-t border-slate-600"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Enter Room Code" 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full bg-background-light dark:bg-background-dark border border-slate-600 rounded p-3 text-center text-xl tracking-widest font-bold focus:border-primary focus:outline-none"
              />
              <button 
                onClick={handleJoinRoom}
                disabled={status !== 'idle' || !roomId}
                className="bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                {status === 'joining' ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold">Room Created!</h2>
            <p className="text-slate-400 text-sm">Share this code with your friend:</p>
            <div className="bg-background-dark border border-primary/50 text-primary text-5xl font-black tracking-widest py-4 px-8 rounded-xl select-all">
              {createdRoomId}
            </div>
            <p className="text-primary animate-pulse text-sm font-bold mt-4">Waiting for opponent to join...</p>
            <button 
              onClick={() => {
                setStatus('idle');
                socket.emit("leaveRoom", {roomId: createdRoomId});
              }}
              className="text-slate-400 hover:text-white underline text-sm mt-4"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
