const express = require("express");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
app.use(express.json());

const BOARD_SIZE = 10;
const SHIPS = [
  { id: "0", size: 5 },
  { id: "1", size: 4 },
  { id: "2", size: 3 },
  { id: "3", size: 3 },
  { id: "4", size: 2 },
  { id: "5", size: 2 },
  { id: "6", size: 2 },
  { id: "7", size: 1 },
  { id: "8", size: 1 },
  { id: "9", size: 1 }
];



let games = {};

function createGame() {
  const gameId = uuidv4();
  let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("."));
  let ships = [];
  let totalShots = 25;
  let currentShots = 0;
  let destroyedShips = 0;

  placeShips(board, ships)

  games[gameId] = { board, ships, totalShots, currentShots, destroyedShips };
  return gameId;
}
function placeShips(board, ships) {
  let maxIter = 10000;
  let iter = 0;
  iter = 0;
  for (let ship of SHIPS) {
    let placed = false;
    iter = 0;
    if (ships.length === SHIPS.length) { break; }
    while (!placed) {
      let x = Math.floor(Math.random() * BOARD_SIZE);
      let y = Math.floor(Math.random() * BOARD_SIZE);
      let horizontal = Math.random() > 0.5;

      if (canPlaceShip(x, y, ship.size, horizontal, board)) {
        addShip(x, y, ship.size, horizontal, ship.id, board);
        ships.push({ ...ship, size: ship.size, hits: 0 });
        placed = true;
        break;
      }
      else {
        //It is possible to randomly place ships in such a way that all ships do not fit
        if (iter === maxIter) {
          resetShips(ships);
          placeShips();
          break;
        }
        iter++;
      }
    }

  }
}

function resetShips(ships) {

  while (ships.length > 0) {
    ships.pop()
  }
}

function canPlaceShip(x, y, size, horizontal, board) {
  if (horizontal) {
    if (x + size > BOARD_SIZE) return false;
    if (x - 1 > -1) {
      if (board[y][x - 1] !== ".") return false;
      if (y - 1 > -1 && board[y - 1][x - 1] !== ".") return false;
      if (y + 1 < BOARD_SIZE && board[y + 1][x - 1] !== ".") return false;
    }
    for (let i = 0; i < size; i++) {
      if (y - 1 > -1 && board[y - 1][x + i] !== ".") return false;
      if (board[y][x + i] !== ".") return false;
      if (y + 1 < BOARD_SIZE && board[y + 1][x + i] !== ".") return false;
    }
    if (x + size < BOARD_SIZE) {
      if (board[y][x + size] !== ".") return false;
      if (y - 1 > -1 && board[y - 1][x + size] !== ".") return false;
      if (y + 1 < BOARD_SIZE && board[y + 1][x + size] !== ".") return false;
    }
  }
  else {
    if (y + size > BOARD_SIZE) return false;
    if (y - 1 > -1) {
      if (board[y - 1][x] !== ".") return false;
      if (x - 1 > -1 && board[y - 1][x - 1] !== ".") return false;
      if (x + 1 < BOARD_SIZE && board[y - 1][x + 1] !== ".") return false;
    }
    for (let i = 0; i < size; i++) {
      if (x - 1 > -1 && board[y + i][x - 1] !== ".") return false;
      if (board[y + i][x] !== ".") return false;
      if (x + 1 < BOARD_SIZE && board[y + i][x + 1] !== ".") return false;
    }
    if (y + size < BOARD_SIZE) {
      if (board[y + size][x] !== ".") return false;
      if (x - 1 > -1 && board[y + size][x - 1] !== ".") return false;
      if (x + 1 < BOARD_SIZE && board[y + size][x + 1] !== ".") return false;
    }
  }
  return true;
}

function addShip(x, y, size, horizontal, id, board) {
  for (let i = 0; i < size; i++) {
    if (horizontal) {
      board[y][x + i] = id;
    } else {
      board[y + i][x] = id;
    }
  }
}
app.get("/new-game", (req, res) => {
  const gameId = createGame();
  res.json({ gameId });
});

app.get("/board/:gameId", (req, res) => {
  const { gameId } = req.params;
  const game = games[gameId];
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json({ board: game.board.map(row => row.map(cell => (cell !== "." ? "." : cell))) });//Not showing where the ships are placed to the client
});

app.post("/attack", (req, res) => {
  const { gameId, x, y } = req.body;
  const game = games[gameId];
  if (!game) return res.status(404).json({ error: "Game not found" });
  if (game.currentShots >= game.totalShots) {
    res.json({ result: "Game over", status: 'success' })
  }
  if (game.board[y][x] !== "." && game.board[y][x] !== "X" && game.board[y][x] !== "O") {
    const shipId = game.board[y][x];
    const ship = game.ships.find(s => s.id === shipId);
    if (ship) {
      ship.hits++;
      if (ship.hits === ship.size) {
        game.destroyedShips++;
        if (game.destroyedShips >= game.ships.length) {
          res.json({ result: "victory", status: 'success' });
        }
        res.json({ result: "destroyed", status: 'success' });
      }
      res.json({ result: "hit", status: 'success' });
    }
    game.board[y][x] = "X";
  } else {
    game.currentShots++;
    game.board[y][x] = "O";
    res.json({ result: "miss", status: 'success' });
  }
});

app.listen(PORT, () => {
  console.log(`Battleship backend running on http://localhost:${PORT}`);
});
