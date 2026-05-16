import { Server } from "socket.io";

export default function setupSocket(io) {
  // Store games in memory
  const games = {}; // roomId -> gameState

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createRoom", ({ username, gameFormat,avatar,inputMethod}) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      games[roomId] = {
        roomId,
        gameFormat,
        players: [{ id: socket.id, username,avatar, score: 0, wickets: 0, ballsFaced: 0 }],
        state: "waiting", // waiting, toss_selection, toss_play, playing, game_over
        turn: null, // toss turn
        tossWinner: null,
        tossChoice: null, // odd, even
        tossPlays: {}, // id -> number
        battingPlayerId: null,
        bowlingPlayerId: null,
        target: null,
        innings: 1,
        currentPlays: {}, // id -> number
        logs: [],
        inputMethod:inputMethod,
        winner: null
      };
      socket.join(roomId);
      socket.emit("roomCreated", { roomId, gameState: games[roomId] ,avatar:avatar});
    });

    socket.on("joinRoom", ({ roomId, username,avatar}) => {
      const game = games[roomId];
      if (!game) {
        socket.emit("roomError", "Room not found");
        return;
      }
      
      const existingPlayerIndex = game.players.findIndex(p => p.username === username);
      
      if (existingPlayerIndex !== -1) {
        // Player is reconnecting (e.g. navigated to the game page)
        const oldId = game.players[existingPlayerIndex].id;
        
        if (game.turn === oldId) game.turn = socket.id;
        if (game.tossWinner === oldId) game.tossWinner = socket.id;
        if (game.battingPlayerId === oldId) game.battingPlayerId = socket.id;
        if (game.bowlingPlayerId === oldId) game.bowlingPlayerId = socket.id;
        
        if (game.tossPlays[oldId] !== undefined) {
          game.tossPlays[socket.id] = game.tossPlays[oldId];
          delete game.tossPlays[oldId];
        }
        if (game.currentPlays[oldId] !== undefined) {
          game.currentPlays[socket.id] = game.currentPlays[oldId];
          delete game.currentPlays[oldId];
        }
        
        game.players[existingPlayerIndex].id = socket.id;
        socket.join(roomId);
        socket.emit("gameStateUpdate", { gameState: game });
      } else if (game.players.length === 1 && game.state === "waiting") {
        // New player 2 joining
        game.players.push({ id: socket.id, username, avatar, score: 0, wickets: 0, ballsFaced: 0 });
        socket.join(roomId);
        game.state = "toss_selection";
        game.turn = game.players[0].id; // Player 1 chooses odd/even
        io.to(roomId).emit("gameStarted", { gameState: game,avatar:avatar});
      } else {
        socket.emit("roomError", "Room full or game already started");
      }
    });

    socket.on("tossCall", ({ roomId, choice }) => { // choice: odd, even
      const game = games[roomId];
      if (game && game.turn === socket.id && game.state === "toss_selection") {
        game.tossChoice = choice;
        game.state = "toss_play";
        io.to(roomId).emit("gameStateUpdate", { gameState: game });
      }
    });

    socket.on("playNumber", ({ roomId, number }) => {
      const game = games[roomId];
      if (!game) return;

      if (game.state === "toss_play") {
        game.tossPlays[socket.id] = number;
        if (Object.keys(game.tossPlays).length === 2) {
          // Resolve toss
          const p1 = game.players[0];
          const p2 = game.players[1];
          const n1 = game.tossPlays[p1.id];
          const n2 = game.tossPlays[p2.id];
          const sum = n1 + n2;
          const isEven = sum % 2 === 0;
          
          game.tossPlays = {}; // reset for next phase
          
          let tossWinnerId;
          // Player 1 made the choice (tossChoice)
          if ((isEven && game.tossChoice === "even") || (!isEven && game.tossChoice === "odd")) {
            tossWinnerId = p1.id;
          } else {
            tossWinnerId = p2.id;
          }
          
          game.tossWinner = tossWinnerId;
          game.state = "toss_decision"; // Winner decides to bat or bowl
          io.to(roomId).emit("gameStateUpdate", { gameState: game });
        }
      } else if (game.state === "playing") {
        game.currentPlays[socket.id] = number;
        if (Object.keys(game.currentPlays).length === 2) {
          // Resolve ball
          const batterId = game.battingPlayerId;
          const bowlerId = game.bowlingPlayerId;
          const batterNumber = game.currentPlays[batterId];
          const bowlerNumber = game.currentPlays[bowlerId];
          
          game.currentPlays = {}; // reset for next ball
          
          const batter = game.players.find(p => p.id === batterId);
          const bowler = game.players.find(p => p.id === bowlerId);
          
          batter.ballsFaced += 1;
          
          if (batterNumber === bowlerNumber) {
            // Wicket
            batter.wickets += 1;
            game.logs.unshift(`WICKET! Both played ${batterNumber}`);
            
            const maxWickets = game.gameFormat === "5_overs" ? 10 : 1;
            
            if (batter.wickets >= maxWickets || (game.innings === 2 && batter.score < bowler.score && batter.wickets >= maxWickets)) {
              handleInningsEnd(game, roomId);
            } else if (game.innings === 2 && batter.score > game.target) {
               game.winner = batterId;
               game.state = "game_over";
               io.to(roomId).emit("gameStateUpdate", { gameState: game });
            } else {
              io.to(roomId).emit("gameStateUpdate", { gameState: game, lastPlay: {batterNumber, bowlerNumber} });
            }
          } else {
            // Runs scored
            batter.score += batterNumber;
            game.logs.unshift(`Batter scored ${batterNumber}`);
            
            if (game.innings === 2 && batter.score > game.target) {
               game.winner = batterId;
               game.state = "game_over";
               io.to(roomId).emit("gameStateUpdate", { gameState: game, lastPlay: {batterNumber, bowlerNumber} });
            } else {
              const maxBalls = game.gameFormat === "5_overs" ? 30 : Infinity;
              if (batter.ballsFaced >= maxBalls) {
                 handleInningsEnd(game, roomId);
              } else {
                 io.to(roomId).emit("gameStateUpdate", { gameState: game, lastPlay: {batterNumber, bowlerNumber} });
              }
            }
          }
        }
      }
    });

    socket.on("tossDecision", ({ roomId, decision }) => { // decision: bat or bowl
      const game = games[roomId];
      if (game && game.tossWinner === socket.id && game.state === "toss_decision") {
        const otherPlayer = game.players.find(p => p.id !== socket.id);
        if (decision === "bat") {
          game.battingPlayerId = socket.id;
          game.bowlingPlayerId = otherPlayer.id;
        } else {
          game.battingPlayerId = otherPlayer.id;
          game.bowlingPlayerId = socket.id;
        }
        game.state = "playing";
        io.to(roomId).emit("gameStateUpdate", { gameState: game });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const oldSocketId = socket.id;
      // Find if user was in any game and notify opponent
      for (const roomId in games) {
        const game = games[roomId];
        if (game.players.some(p => p.id === oldSocketId)) {
          // Give them 5 seconds to reconnect during navigation
          setTimeout(() => {
            const currentGame = games[roomId];
            if (currentGame) {
              // If the player hasn't updated their socket ID (meaning they didn't reconnect)
              const playerStillDisconnected = currentGame.players.find(p => p.id === oldSocketId);
              if (playerStillDisconnected) {
                io.to(roomId).emit("opponentDisconnected");
                delete games[roomId];
              }
            }
          }, 5000);
        }
      }
    });
    
    socket.on("leaveRoom", ({roomId}) => {
       const game = games[roomId];
       if(game) {
          socket.leave(roomId);
          io.to(roomId).emit("opponentDisconnected");
          delete games[roomId];
       }
    });
  });

  function handleInningsEnd(game, roomId) {
    if (game.innings === 1) {
      game.innings = 2;
      const batter = game.players.find(p => p.id === game.battingPlayerId);
      game.target = batter.score;
      // Swap batting/bowling
      const temp = game.battingPlayerId;
      game.battingPlayerId = game.bowlingPlayerId;
      game.bowlingPlayerId = temp;
      game.logs.unshift(`Innings Break! Target is ${game.target}`);
      io.to(roomId).emit("gameStateUpdate", { gameState: game, lastPlay: null });
    } else {
      // Game Over
      game.state = "game_over";
      const batter = game.players.find(p => p.id === game.battingPlayerId);
      const bowler = game.players.find(p => p.id === game.bowlingPlayerId);
      
      if (batter.score > game.target) {
        game.winner = batter.id;
      } else if (batter.score < game.target) {
        game.winner = bowler.id;
      } else {
        game.winner = "tie";
      }
      io.to(roomId).emit("gameStateUpdate", { gameState: game, lastPlay: null });
      // Clean up game from memory after a delay to allow clients to receive the final state
      setTimeout(() => { delete games[roomId]; }, 30000);
    }
  }
}
