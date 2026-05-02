import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const GameLobby = lazy(() => import('./pages/GameLobby'));
const ActiveGame = lazy(() => import('./pages/ActiveGame'));
const GameOver = lazy(() => import('./pages/GameOver'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Rankings = lazy(() => import('./pages/Rankings'));
const CameraMode = lazy(() => import('./pages/CameraMode'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Settings = lazy(() => import('./pages/Settings'));
const Friends = lazy(() => import('./pages/Friends'));

const LoadingFallback = () => (
  <div className="flex-1 flex justify-center items-center bg-gray-950">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-75"></div>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lobby" element={<GameLobby />} />
            <Route path="/classic" element={<ActiveGame />} />
            <Route path="/game-over" element={<GameOver />} />
            <Route path="/guide" element={<UserGuide />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/camera" element={<CameraMode />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friends" element={<Friends />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
