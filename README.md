# 🏏 DigiCric

Welcome to **DigiCric**! This is an interactive, full-stack web application that brings the nostalgia of "Hand Cricket" out of the classroom and straight into the digital age. Compete against a simulated AI agent, or challenge your friends in real-time multiplayer, using classic on-screen controls or dynamically playing entirely in the physical space via state-of-the-art Webcam Machine Learning finger tracking!

---

## ✨ Features

- **Robust Authentication Module**  
  Full end-to-end user authentication with modern security practices. Register, Login, securely persist sessions via JWT, manage avatars natively, and safely execute account modifications seamlessly.

- **Friends & Social Ecosystem**
  Add friends, accept/reject friend requests, and maintain a friends list. Challenge your friends to real-time matches through the dedicated multiplayer lobby!

- **Single Player & Real-Time Multiplayer Gameplay**
  DigiCric features both PvE (Player vs Environment/CPU) and PvP (Player vs Player) multiplayer, powered by real-time WebSocket communication. Engage in single-wicket rapid-fire games or strategic 5-Over matches.
  
- **Dual Gameplay Input Modes**
  - **🕹️ Classic Mode:** A tactical HUD-based Hand Cricket experience. Make your toss call, bat or bowl, and click to select your runs strategically!
  - **📷 Camera Mode (_Powered by ML_):** Unleash raw interactivity by utilizing your webcam! By integrating **Google MediaPipe HandLandmarker**, DigiCric securely reads your physical hand gestures directly inside your browser. No video is ever sent to a server. Simply raise your fingers—`1 to 5`, or display a `Closed Fist / Thumb-Up` to strike a `6`!

- **Progressive Global Statistics & Rankings**  
  Climb the ranks! The MongoDB backend tracks every match you play, updating your Wins, Losses, Runs, Net Run Rate, XP, Volts, and dynamic Level/Rank.

- **High-Performance Caching with Redis**  
  Experience lightning-fast data retrieval for high-traffic endpoints. Current user profiles and global leaderboards are cached using Redis, drastically reducing MongoDB queries and improving overall scalability and responsiveness.

- **Dynamic Polish & Animations**  
  Immersive visual experience utilizing **GSAP**. Smooth loading screen sequences, glowing profiles, interactive timing rhythms, and responsive UI components powered by Tailwind CSS.

---

## 🔀 Game Data Flow & Architecture

DigiCric employs a modern React frontend and a Node.js/Express backend, bridged together by robust REST APIs and real-time Socket.IO communication.

### 1. REST API (Authentication & Socials)
- **User Management**: When a user registers or logs in, the server hashes the password with bcrypt and signs JWT tokens (Access and Refresh). These are sent back as secure `HttpOnly` cookies.
- **High-Speed Caching**: Critical data such as the authenticated user's profile and global leaderboards are retrieved through an optimized **Redis caching layer**, minimizing database overhead.
- **Friends System**: Operations like sending requests, accepting friends, and searching profiles occur over standard REST endpoints.
- **Stats Sync**: Upon finishing a match, the client computes XP/Volts/Net Run Rate and triggers a `PATCH /api/v1/users/update-stats` request to securely update the user's document in MongoDB.

### 2. Socket.IO (Multiplayer Engine)
- **Rooms & Matchmaking**: When a player hosts or joins a multiplayer game, they connect to a Socket.IO namespace and join a unique `roomId`. 
- **State Machine**: The server maintains a centralized, in-memory state object (`gameState`) for each room. The state transitions logically: `toss_selection` ➔ `toss_decision` ➔ `playing` ➔ `game_over`.
- **Data Synchronization**: Players emit actions (e.g., `playNumber` or `tossCall`). The server registers both actions, resolves the turn (checking if the batsman was dismissed or scored), clears the temporary selections, and broadcasts the updated `gameState` and `lastPlay` object to both clients simultaneously.
- **Client Prediction**: The frontend utilizes local state (`hasPlayed`) to provide immediate, optimistic UI feedback ("Waiting for opponent...") while waiting for the server's authoritative `gameStateUpdate`.

### 3. Machine Learning Camera Feed (MediaPipe)
- The user grants webcam permissions, and a video stream is fed to an invisible HTML `<video>` element.
- **Google MediaPipe** asynchronously analyzes video frames locally using WebAssembly.
- The model maps 21 3D hand landmarks in real-time. Custom geometric logic calculates distances (e.g., Euclidean distance between finger tips and wrist) to accurately count raised fingers (`1-5`) or detect a thumbs-up gesture for `6`.
- Once a valid gesture is registered and the countdown concludes, the determined integer is piped into the game logic/socket identically to a classic button press.

---

## 🛠️ Tech Stack & Dependencies

**Frontend Core Dependencies**
- `react` & `react-dom` (v19) - Core UI framework.
- `react-router-dom` - Client-side routing.
- `tailwindcss` (v4) - Utility-first styling framework.
- `gsap` & `@gsap/react` - Advanced animation library.
- `@mediapipe/tasks-vision` - Google's ML library for hand gesture tracking.
- `socket.io-client` - Real-time websocket client.

**Backend Core Dependencies**
- `express` (v5) - Web server framework.
- `mongoose` - MongoDB object modeling tool.
- `redis` - In-memory data structure store used as a high-performance cache.
- `socket.io` - Real-time websocket server.
- `jsonwebtoken` - Secure JWT token generation/validation.
- `bcrypt` - Password hashing.
- `cors`, `cookie-parser`, `dotenv` - Middleware and configuration handlers.

---

## 🚀 Installation & Setup Guide

### 1. Requirements
Ensure you have the following installed on your machine:
- Node.js (v18+)
- MongoDB (Running locally or via MongoDB Atlas URI)
- Redis (Running locally or via cloud Redis URL)
- Git

### 2. Repository Setup
Clone the repository to your local machine:
```bash
git clone https://github.com/Harsh-R-Singh/DigiCric.git
cd DigiCric
```

### 3. Backend Configuration (`/Backend`)
Navigate to the Backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `/Backend` directory and populate it with the following environment variables:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digicric?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d
REDIS_URL=redis://localhost:6379
```
*(Note: Replace `<username>`, `<password>`, and secrets with your own values).*

Once your `.env` is configured, start the backend development server:
```bash
npm run dev
```
You should see messages confirming the server is listening and connected to MongoDB.

### 4. Frontend Configuration (`/Frontend`)
Open a new terminal window, navigate to the Frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `/Frontend` directory to map API requests to your local backend:
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend Vite development server:
```bash
npm run dev
```

### 5. Play!
Open your browser and navigate to the localhost port provided by Vite (usually `http://localhost:5173`). 
Register a new account, test your webcam in the Camera Mode, and invite a friend to test the real-time Multiplayer Lobby!

---

## 📝 License & Authorship

Developed exclusively by **Harsh Raj Singh**.
