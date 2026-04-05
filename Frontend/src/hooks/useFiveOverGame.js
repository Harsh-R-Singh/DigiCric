import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  phase: 'toss_selection', // 'toss_selection', 'toss_play', 'toss_decision', 'playing', 'game_over'
  tossChoice: null, // 'odd' or 'even'
  tossWinner: null, // 'user' or 'cpu'
  innings: 1, // 1 or 2
  userBatting: null, // true if user is batting, false if CPU is batting (null until decided)
  userScore: 0,
  cpuScore: 0,
  userWickets: 0, // Track wickets explicitly
  cpuWickets: 0, // Track wickets explicitly
  target: null,
  ballsFaced: 0, // Current inning balls faced
  userBallsFaced: 0, // Total user balls faced across match
  cpuBallsFaced: 0, // Total CPU balls faced across match
  userLastChoice: null,
  cpuLastChoice: null,
  isGameOver: false,
  winner: null, // 'user', 'cpu', 'tie'
  comments: [], // Action log for the UI string[]
};

const MAX_OVERS = 5;
const MAX_BALLS = MAX_OVERS * 6;
const MAX_WICKETS = 10;

export function useFiveOverGame() {
  const [gameState, setGameState] = useState(INITIAL_STATE);

  const chooseToss = useCallback((choice) => {
    setGameState(prev => ({
      ...prev,
      tossChoice: choice,
      phase: 'toss_play',
      comments: [`You called ${choice.toUpperCase()}. Play a number!`, ...prev.comments]
    }));
  }, []);

  const playToss = useCallback((userNumber) => {
    setGameState(prev => {
      if (prev.phase !== 'toss_play') return prev;

      const cpuNumber = Math.floor(Math.random() * 6) + 1;
      const sum = userNumber + cpuNumber;
      const isSumEven = sum % 2 === 0;
      
      const userWonToss = (prev.tossChoice === 'even' && isSumEven) || (prev.tossChoice === 'odd' && !isSumEven);
      const tossWinner = userWonToss ? 'user' : 'cpu';
      
      let nextState = {
        ...prev,
        userLastChoice: userNumber,
        cpuLastChoice: cpuNumber,
        tossWinner,
        comments: [`You played ${userNumber}, CPU played ${cpuNumber}. Sum is ${sum} (${isSumEven ? 'Even' : 'Odd'}).`, ...prev.comments]
      };

      if (userWonToss) {
        nextState.phase = 'toss_decision';
        nextState.comments.unshift(`You won the toss! Choose to Bat or Bowl.`);
      } else {
        const cpuDecision = Math.random() < 0.5 ? 'bat' : 'bowl';
        nextState.userBatting = cpuDecision !== 'bat';
        nextState.phase = 'playing';
        nextState.comments.unshift(`CPU won the toss and chose to ${cpuDecision.toUpperCase()}.`);
      }
      
      return nextState;
    });
  }, []);

  const chooseBatOrBowl = useCallback((decision) => {
    setGameState(prev => {
      if (prev.phase !== 'toss_decision') return prev;
      
      return {
        ...prev,
        userBatting: decision === 'bat',
        phase: 'playing',
        comments: [`You chose to ${decision.toUpperCase()}. Match starts now!`, ...prev.comments]
      };
    });
  }, []);

  const playBall = useCallback((userChoice) => {
    setGameState(prev => {
      if (prev.phase !== 'playing' || prev.isGameOver) return prev;

      const cpuChoice = Math.floor(Math.random() * 6) + 1;
      
      let nextState = { 
        ...prev, 
        userLastChoice: userChoice, 
        cpuLastChoice: cpuChoice,
        ballsFaced: prev.ballsFaced + 1,
        comments: [...prev.comments]
      };

      if (nextState.userBatting) {
        nextState.userBallsFaced += 1;
      } else {
        nextState.cpuBallsFaced += 1;
      }

      const isWicket = userChoice === cpuChoice;
      const runsScored = nextState.userBatting ? userChoice : cpuChoice;

      if (!isWicket) {
        // Add runs
        if (nextState.userBatting) {
          nextState.userScore += runsScored;
          nextState.comments.unshift(`You scored ${runsScored} runs.`);
        } else {
          nextState.cpuScore += runsScored;
          nextState.comments.unshift(`CPU scored ${runsScored} runs.`);
        }

        // Check if target is chased down in 2nd innings
        if (nextState.innings === 2) {
          const currentChasingScore = nextState.userBatting ? nextState.userScore : nextState.cpuScore;
          if (currentChasingScore >= nextState.target) {
            nextState.isGameOver = true;
            nextState.winner = nextState.userBatting ? 'user' : 'cpu';
            nextState.comments.unshift(`${nextState.winner === 'user' ? 'You' : 'CPU'} won by chasing the target!`);
            return nextState; // Break early so we don't hit over limits
          }
        }
      } else {
        // Wicket
        if (nextState.userBatting) {
          nextState.userWickets += 1;
        } else {
          nextState.cpuWickets += 1;
        }
        nextState.comments.unshift(`Wicket! Both chose ${userChoice}.`);
      }

      // Check for End of Innings conditions (All Out OR Overs limit)
      const currentWickets = nextState.userBatting ? nextState.userWickets : nextState.cpuWickets;
      const isAllOut = currentWickets >= MAX_WICKETS;
      const isOverLimit = nextState.ballsFaced >= MAX_BALLS;

      if (isAllOut || isOverLimit) {
        if (isAllOut && !isWicket) {
           // Fallback, shouldn't hit unless logic error
        } else if (isOverLimit) {
           nextState.comments.unshift(`End of overs (${MAX_OVERS})!`);
        } else if (isAllOut) {
           nextState.comments.unshift(`All out!`);
        }

        if (nextState.innings === 1) {
          // Change Innings
          nextState.innings = 2;
          nextState.target = nextState.userBatting ? nextState.userScore + 1 : nextState.cpuScore + 1;
          nextState.userBatting = !nextState.userBatting;
          nextState.ballsFaced = 0;
          nextState.comments.unshift(`Innings Break! Target is ${nextState.target}.`);
        } else {
          // Game Over (Defending team wins or Tie)
          nextState.isGameOver = true;
          const defendingTeamRuns = nextState.userBatting ? nextState.cpuScore : nextState.userScore;
          const battingTeamRuns = nextState.userBatting ? nextState.userScore : nextState.cpuScore;
          
          if (defendingTeamRuns > battingTeamRuns) {
            nextState.winner = nextState.userBatting ? 'cpu' : 'user';
            nextState.comments.unshift(`${nextState.winner === 'user' ? 'You' : 'CPU'} won by ${defendingTeamRuns - battingTeamRuns} runs!`);
          } else if (defendingTeamRuns === battingTeamRuns) {
            nextState.winner = 'tie';
            nextState.comments.unshift(`Match tied!`);
          }
        }
      }

      if (nextState.comments.length > 20) {
        nextState.comments = nextState.comments.slice(0, 20);
      }

      return nextState;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  return {
    ...gameState,
    gameMode: '5 Overs',
    maxOvers: MAX_OVERS,
    maxWickets: MAX_WICKETS,
    chooseToss,
    playToss,
    chooseBatOrBowl,
    playBall,
    resetGame
  };
}
