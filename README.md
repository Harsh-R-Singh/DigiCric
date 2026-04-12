# 🏏 DigiCric

Welcome to **DigiCric**! This is an interactive, full-stack web application that brings the nostalgia of "Hand Cricket" out of the classroom and straight into the digital age. Compete against a simulated AI agent using classic on-screen controls, or dynamically play entirely in the physical space via state-of-the-art Webcam Machine Learning finger tracking!

---

## ✨ Features

- **Robust Authentication Module**  
  Full end-to-end user authentication with modern security practices. Register, Login, securely persist sessions via JWT, manage avatars natively, and safely execute account modifications seamlessly.

- **Dual Gameplay Modes**
  - **🕹️ Classic Mode:** A tactical HUD-based Hand Cricket experience offering Single Wicket and 5-Over Match parameters. Toss, make batting/bowling decisions, and select your runs against the CPU strategically!
  - **📷 Camera Mode (_Powered by ML_):** Unleash raw interactivity by utilizing your webcam! By integrating **Google MediaPipe HandLandmarker**, DigiCric securely reads your physical hand gestures locally directly inside your browser. No video is ever sent to a server. Simply raise your fingers—`1 to 5`, or display a `Closed Fist / Thumb-Up` to strike a `6`! 

- **Progressive Global Statistics**  
  Climb the ranks! The MongoDB backend tracks every match you play, updating your Wins, Losses, Runs, Net Run Rate, XP, Volts, and dynamic Level/Rank.

- **Dynamic Polish & Animations**  
  Immersed visual and auditory experience utilizing **GSAP**. Smooth loading screen sequences, blazing profile displays, interactive timing rhythms (`3..2..1.. SHOOT!`), and integrated sound effects.

---

## 🛠️ Tech Stack

**Frontend**
- **React (v19)** with Vite
- **Tailwind CSS (v4)** for ultra-fast, highly modern visual responsive structuring.
- **GSAP** for crisp micro-interactions and animations.
- **@mediapipe/tasks-vision** for local, secure Hand Machine Learning processing.

**Backend**
- **Node.js & Express (v5)**
- **MongoDB / Mongoose** for NoSQL robust structural database queries.
- **JWT (JSON Web Tokens)** + **Bcrypt** for hashing passwords and securely verifying routing via HTTP-Only Cookies.

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have the following installed on your machine:
- Node.js (v18+)
- MongoDB (Running locally or via MongoDB Atlas URI)

### 2. Installation
Ensure you install Dependencies gracefully.
```bash
# Clone the repository
git clone https://github.com/Harsh-R-Singh/DigiCric.git
cd DigiCric
```

### 3. Setup Backend (`/Backend`)
```bash
cd Backend
npm install
```
You will need to create a `.env` file in the `/Backend` directory handling:
```env
PORT=...
MONGODB_URI=...
CORS_ORIGIN=...
ACCESS_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRY=...
REFRESH_TOKEN_SECRET=...
REFRESH_TOKEN_EXPIRY=...
```
Once configured, run:
```bash
npm run dev
```

### 4. Setup Frontend (`/Frontend`)
```bash
cd ../Frontend
npm install
```
A `.env` config isn't specifically necessary locally, Vite maps API requests to your local backend routes. Run the react application alongside:
```bash
npm run dev
```

Your system is now live! Open your designated localhost port provided by Vite. 

---

## 📝 License & Authorship

Developed exclusively by **Harsh Raj Singh**. 
