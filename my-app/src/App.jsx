import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GameLobby from './pages/GameLobby';
import ActiveGame from './pages/ActiveGame';
import GameOver from './pages/GameOver';
import UserGuide from './pages/UserGuide';
import UserProfile from './pages/UserProfile';
import Rankings from './pages/Rankings';
import CameraMode from './pages/CameraMode';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lobby" element={<GameLobby />} />
          <Route path="/game" element={<ActiveGame />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/camera" element={<CameraMode />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
