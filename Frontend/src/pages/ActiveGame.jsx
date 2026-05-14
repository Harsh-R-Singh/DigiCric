import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSingleWicketGame } from '../hooks/useSingleWicketGame';
import { useFiveOverGame } from '../hooks/useFiveOverGame';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
const avatarImages = import.meta.glob('../assets/avatar/*.png', { eager: true, import: 'default' });
const getAvatarUrl = (avatarName) => {
  if (!avatarName) return avatarImages['../assets/avatar/Avatar1.png'];
  const normalizedName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);
  return avatarImages[`../assets/avatar/${normalizedName}.png`] || avatarImages['../assets/avatar/Avatar1.png'];
};

export default function ActiveGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef();
  
  const userHandRef = useRef();
  const cpuHandRef = useRef();
  const [inningsBreakWait, setInningsBreakWait] = useState(false);
  const prevInnings = useRef(1);

  // Mode from routing: 'single_wicket' or '5_overs'. Default to 'single_wicket'
  const mode = location.state?.gameFormat || 'single_wicket';
  const gameMode = location.state?.gameMode || 'classic';
  const userProfile = location.state?.userProfile;
  // console.log(location.state);
  // console.log(userProfile);
  // We unconditionally call both hooks to satisfy React's rules of hooks
  const singleWicketGame = useSingleWicketGame();
  const fiveOverGame = useFiveOverGame();

  // Assign the active game instance based on the selected mode
  const game = mode === '5_overs' ? fiveOverGame : singleWicketGame;

  const {
    phase, tossChoice, innings, userBatting,
    userScore, cpuScore, target, userLastChoice, cpuLastChoice,
    isGameOver, comments, ballsFaced, userBallsFaced, cpuBallsFaced, 
    userWickets, cpuWickets, winner, maxOvers, gameFormat,
    chooseToss, playToss, chooseBatOrBowl, playBall
  } = game;

  useGSAP(() => {
    gsap.from(".animate-in", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  useGSAP(() => {
    if (userLastChoice !== null) {
      gsap.fromTo(userHandRef.current, 
        { scale: 0.5, y: 20, opacity: 0, rotation: -15 }, 
        { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }
      );
      gsap.fromTo(cpuHandRef.current, 
        { scale: 0.5, y: 20, opacity: 0, rotation: 15 }, 
        { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", delay: 0.1 }
      );
    }
  }, { dependencies: [comments] });

  useEffect(() => {
    if (innings === 2 && prevInnings.current === 1) {
      setInningsBreakWait(true);
      const t = setTimeout(() => {
        setInningsBreakWait(false);
      }, 3000);
      prevInnings.current = 2;
      return () => clearTimeout(t);
    }
  }, [innings]);

  const updateDbDone = useRef(false);

  useEffect(() => {
    if (isGameOver) {
      let netRunRate=0;
      let voltsEarned=0;
      let xpEarned=0;
      if (!updateDbDone.current) {
        updateDbDone.current = true;
        
        const isUserWin = winner === 'user';
        const isCpuWin = winner === 'cpu';
        const isTie = winner === 'tie';

        let xp = 100;
        const uBalls = userBallsFaced || 1;
        const cBalls = cpuBallsFaced || 1;

        if(game=='5_overs'){
          if (isUserWin) xp = (((userScore / 5) - (cpuScore / 5))*100);
          else if (isCpuWin) xp = (((cpuScore / 5) - (userScore / 5))*100);
        }
        else{
          if (isUserWin) xp = (((userScore /Math. max(uBalls,cBalls)) - (cpuScore / Math.max(cBalls,uBalls)))*100);
          else if (isCpuWin) xp = (((cpuScore / Math.max(cBalls,uBalls)) - (userScore / Math.max(uBalls,cBalls)))*100);
        }

        voltsEarned = isUserWin ? Math.round(xp) : (isTie ? 0 : -Math.round(xp/2));
        xpEarned = isUserWin ? Math.round(xp) : (isTie ? Math.round(xp/2) : Math.round(xp/3));
        netRunRate = isUserWin ? parseFloat((xp/100).toFixed(3)) : (isTie ? 0 : parseFloat((-xp/100).toFixed(3)));

        const formData = {
          winner: isUserWin ? 1 : 0,
          loses: isCpuWin ? 1 : 0,
          draws: isTie ? 1 : 0,
          userScore: userScore || 0,
          runsConceded: cpuScore || 0,
          wicketsTaken: cpuWickets || 0,
          user: userProfile?.username,
          netRunRate: netRunRate,
          volts: voltsEarned,
          xp: xpEarned
        };

        const pushStats = async () => {
          try {
            const response = await fetch(`${API_URL}/api/v1/users/update-stats`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
              credentials: 'include'
            });
            const data = await response.json();
            console.log("Stats updated:", data);
          } catch (error) {
            console.log("Stats update failed:", error);
          }
        };

        pushStats();
      }

      const timer = setTimeout(() => {
        // Pass full state to game over scoreboard
        navigate('/game-over', { state: { 
            winner, 
            userScore, 
            cpuScore, 
            userBallsFaced, 
            cpuBallsFaced,
            userWickets: userWickets ?? 1, // Single wicket doesn't emit userWickets count so fallback to 1 Wicket max
            cpuWickets: cpuWickets ?? 1,
            target,
            gameFormat: mode,
            gameMode: gameMode,
            userProfile: userProfile,
            netRunRate: netRunRate,
            voltsEarned: voltsEarned,
            xpEarned: xpEarned
        } });
      }, 3500); 
      return () => clearTimeout(timer);
    }
  }, [isGameOver, navigate, winner, userScore, cpuScore, userBallsFaced, cpuBallsFaced, userWickets, cpuWickets, target, mode]);

  const formatOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainder = balls % 6;
    return `${overs}.${remainder}`;
  };

  return (
    <div ref={containerRef} className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen w-full flex flex-col">
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 gap-6">
        
        {/* Scoreboard Section */}
        <div className="w-full animate-in mb-4">
          {phase === 'playing' || isGameOver ? (
            <div className="bg-background-dark/80 backdrop-blur-md rounded-2xl border border-primary/20 p-2 shadow-xl flex flex-col md:flex-row justify-between items-stretch gap-2">
               {/* User Score Block */}
               <div className={`flex flex-col justify-center items-center md:items-start w-full md:w-1/3 p-4 rounded-xl border transition-all ${userBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start w-full">
                     <p className="font-bold text-white uppercase tracking-wider text-sm">You</p>
                     {userBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                  </div>
                  <div className="flex items-baseline gap-1 justify-center md:justify-start w-full">
                    <p className="text-4xl font-bold font-display text-white">{userScore} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {userWickets}</span>}</p>
                    {userBatting && <p className="text-primary text-sm font-bold ml-1">({formatOvers(ballsFaced)} ov)</p>}
                  </div>
               </div>

               {/* Match Info Block */}
               <div className="flex flex-col items-center justify-center w-full md:w-1/3 px-4 border-y md:border-y-0 md:border-x border-slate-700/50 py-4 md:py-2">
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{target ? 'Target' : 'Current Phase'}</p>
                  <p className="text-4xl font-bold font-display text-white">{target || '1st Innings'}</p>
                  <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Innings {innings}</p>
               </div>

               {/* CPU Score Block */}
               <div className={`flex flex-col justify-center items-center md:items-end w-full md:w-1/3 p-4 rounded-xl border transition-all ${!userBatting ? 'bg-primary/20 border-primary shadow-[inset_0_0_20px_rgba(236,91,19,0.2)]' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-end flex-row-reverse w-full">
                     <p className="font-bold text-white uppercase tracking-wider text-sm">CPU</p>
                     {!userBatting ? <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BATTING</span> : <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded-full font-bold tracking-widest">BOWLING</span>}
                  </div>
                  <div className="flex items-baseline gap-1 justify-center md:justify-end flex-row-reverse w-full">
                    <p className="text-4xl font-bold font-display text-white">{cpuScore} {mode === '5_overs' && <span className="text-2xl text-white/50">/ {cpuWickets}</span>}</p>
                    {!userBatting && <p className="text-primary text-sm font-bold mr-1">({formatOvers(ballsFaced)} ov)</p>}
                  </div>
               </div>
            </div>
          ) : (
             <div className="w-full flex flex-col gap-1 rounded-xl p-6 bg-primary/10 border border-primary/20 items-center justify-center text-center shadow-lg">
                <p className="text-primary text-xs font-bold uppercase tracking-wider">Toss Phase</p>
                <p className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {phase === 'toss_selection' ? 'Call Odd or Even' : phase === 'toss_play' ? `You called ${tossChoice?.toUpperCase()}` : 'Decision Time'}
                </p>
             </div>
          )}
        </div>

        {/* Game Arena / Split View */}
        <div className="flex-1 stadium-gradient rounded-2xl overflow-hidden relative border border-white/10 min-h-[400px] flex flex-col justify-center animate-in">
          
          {comments.length > 0 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30 z-10 text-center w-[90%] md:w-auto shadow-lg">
              <p className="text-primary font-bold text-sm">{comments[0]}</p>
            </div>
          )}

          <div className="flex justify-around items-center w-full px-4 gap-8">
            {/* Player Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-primary bg-background-dark/80 flex items-center justify-center text-primary overflow-hidden shadow-[0_0_20px_rgba(236,91,19,0.2)]">
                  <img alt="Player Avatar" className="w-full h-full object-cover" src={getAvatarUrl(userProfile?.avatar)} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap">
                  You {phase === 'playing' ? (userBatting ? '(Batting)' : '(Bowling)') : ''}
                </div>
              </div>
              <div ref={userHandRef} className="w-20 h-20 bg-background-dark/50 backdrop-blur-md rounded-xl border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                <span className="text-4xl font-bold font-display">{userLastChoice || '?'}</span>
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center">
              <div className="h-16 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <div className="text-primary font-bold text-2xl font-display my-2 italic">VS</div>
              <div className="h-16 w-0.5 bg-gradient-to-b from-primary via-primary to-transparent"></div>
            </div>

            {/* CPU Side */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-slate-500 bg-background-dark/80 flex items-center justify-center text-slate-400 overflow-hidden shadow-lg">
                  <img alt="CPU Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpxlZ0loTDpxwg0HRlhWUGl_0R-N215f0q4Q1chcr0Mg10bNIjak87cVV8LgP5S6U2uXzkk7KhNbDi-37ODnVEBIpYbNi8YHKuUS1M4lAV4Znzq-YVs3E_8t9f8_QFOm6CE1OOS0aNW5CZ6s_bT40Tabe1BhIMiSqMbR5kO_tnj96jXIUz6dHYjneSUa0fuQG1eNMpDelTqn5aY3x5bi5BjqU90WTqnN-wjsg948teHBwim5rclkcdOKIC4_Sw28NlLfXrhdGkHMc" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-600 px-3 py-1 rounded-full text-xs font-bold text-white uppercase whitespace-nowrap">
                  CPU {phase === 'playing' ? (!userBatting ? '(Batting)' : '(Bowling)') : ''}
                </div>
              </div>
              <div ref={cpuHandRef} className="w-20 h-20 bg-background-dark/50 backdrop-blur-md rounded-xl border border-slate-500/30 flex items-center justify-center text-slate-400 shadow-inner">
                <span className="text-4xl font-bold font-display">{cpuLastChoice || '?'}</span>
              </div>
            </div>
          </div>

          {phase === 'playing' && target && innings === 2 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background-dark/90 px-6 py-2 rounded-full border border-primary/30 text-center w-[90%] md:w-auto">
              <p className="text-primary font-medium text-sm">Need {target - (userBatting ? userScore : cpuScore)} more runs to win</p>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-6 pb-8 animate-in">
          
          {phase === 'toss_selection' && (
            <>
              <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display">Toss Call</h3>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                <button onClick={() => chooseToss('odd')} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">ODD</span>
                </button>
                <button onClick={() => chooseToss('even')} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">EVEN</span>
                </button>
              </div>
            </>
          )}

          {phase === 'toss_decision' && (
            <>
              <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display">Choose to Bat or Bowl</h3>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full">
                <button onClick={() => chooseBatOrBowl('bat')} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">BAT</span>
                </button>
                <button onClick={() => chooseBatOrBowl('bowl')} className="group flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display">BOWL</span>
                </button>
              </div>
            </>
          )}

          {(phase === 'toss_play' || phase === 'playing') && !isGameOver && !inningsBreakWait && (
            <>
              <h3 className="text-center text-slate-900 dark:text-white text-lg font-bold font-display">
                {phase === 'toss_play' ? 'Play for Toss' : 'Choose your move'}
              </h3>
              <div className="grid grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button 
                    key={num} 
                    onClick={() => phase === 'toss_play' ? playToss(num) : playBall(num)} 
                    className="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background-light dark:bg-primary/5 border border-primary/20 hover:bg-primary hover:border-primary active:scale-[0.95] transition-all duration-200"
                  >
                    <span className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-white font-display leading-none">{num}</span>
                    <span className="material-symbols-outlined text-primary group-hover:text-white">
                      {num % 2 === 0 ? 'celebration' : 'back_hand'}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {inningsBreakWait && (
            <div className="text-center py-6 bg-primary/10 rounded-xl border border-primary/20 animate-in">
               <h3 className="text-primary text-2xl font-bold font-display animate-pulse">Innings Break!</h3>
               <p className="text-slate-500 font-medium mt-2">Target is {target}</p>
            </div>
          )}

          {isGameOver && (
            <div className="text-center py-4 bg-primary/10 rounded-xl border border-primary/20">
               <h3 className="text-primary text-xl font-bold font-display animate-pulse">Match Finished! Proceeding to results...</h3>
            </div>
          )}

          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>{mode === '5_overs' ? '5 Overs' : 'Single Wicket'} {gameMode === 'camera' ? 'Camera' : 'Classic'} Mode</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isGameOver ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {isGameOver ? 'Match Over' : 'Match Live'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
