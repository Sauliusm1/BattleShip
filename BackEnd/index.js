const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.json());

const BOARD_SIZE = 10;
const SHIPS = [
  { id: 0, size: 5 },
  { id: 1, size: 4 },
  { id: 2, size: 3 },
  { id: 3, size: 3 },
  { id: 4, size: 2 },
  { id: 5, size: 2 },
  { id: 6, size: 2 },
  { id: 7, size: 1 },
  { id: 8, size: 1 },
  { id: 9, size: 1 },
];

let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("."));
let ships = [];
let maxIter = 10000;
let iter = 0;
function placeShips() {
  iter = 0;
  for (let ship of SHIPS) {
    let placed = false;
    iter = 0;
    console.log(ship)
    while (!placed) {
      let x = Math.floor(Math.random() * BOARD_SIZE);
      let y = Math.floor(Math.random() * BOARD_SIZE);
      let horizontal = Math.random() > 0.5;
      
      if (canPlaceShip(x, y, ship.size, horizontal)) {
        addShip(x, y, ship.size, horizontal);
        ships.push({ ...ship, size: ship.size, hits: 0 });
        placed = true;
        console.log(ship)
        break;
      }
      else{
        //It is possible to randomly place ships in such a way that all ships do not fit

        if(iter === maxIter){

          resetShips();
          break;
        }
        iter++;
      }
    }

  }
}

function resetShips(){

  while(ships.length > 0){
    ships.pop()
  }
}

function canPlaceShip(x, y, size, horizontal) {
  if (horizontal) {
    if (x + size > BOARD_SIZE) return false;
    if(x-1 > -1){
      if(board[y][x-1]!==".") return false;
      if(y-1 > -1 && board[y-1][x-1]!==".") return false;
      if(y+1 < BOARD_SIZE && board[y+1][x-1]!==".") return false;
    }
    for (let i = 0; i < size; i++) {
      if(y-1 > -1 && board[y-1][x+i]!==".") return false;
      if(board [y][x+i]!==".") return false;
      if(y+1 < BOARD_SIZE && board[y+1][x+i]!==".") return false;
    }
    if(x+size < BOARD_SIZE) { 
      if(board[y][x+size]!==".") return false;
      if(y-1 > -1 && board[y-1][x+size]!==".") return false;
      if(y+1 < BOARD_SIZE && board[y+1][x+size]!==".") return false;
    }
  } 
  else {
    if (y + size > BOARD_SIZE) return false;
    if (y-1 > -1){
      if(board[y-1][x]!==".") return false;
      if(x-1 > -1 && board[y-1][x-1]!==".") return false;
      if(x+1 < BOARD_SIZE && board[y-1][x+1]!==".") return false;
    }
    for (let i = 0; i < size; i++) {
      if(x-1 > -1 && board[y+i][x-1]!==".") return false;
      if(board [y+i][x]!==".") return false;
      if(x+1 < BOARD_SIZE && board[y+i][x+1]!==".") return false;
    }
    if(y+size < BOARD_SIZE){
      if(board[y+size][x]!==".") return false;
      if(x-1 > -1 && board[y+size][x-1]!==".") return false;
      if(x+1 < BOARD_SIZE && board[y+size][x+1]!==".") return false;
    }
  }
  return true;
}

function addShip(x, y, size, horizontal, id) {
  for (let i = 0; i < size; i++) {
    if (horizontal) {
      board[y][x + i] = String(id);
    } else {
      board[y + i][x] = String(id);
    }
  }
}

app.get("/board", (req, res) => {
  placeShips();
  res.json({ board: board.map(row => row.map(cell => (cell !== "." ? "." : cell))) });//Not showing where the ships are placed to the client
});

app.post("/attack", (req, res) => {
  const { x, y } = req.body;
  console.log("HALP");
  if (board[y][x] !== "." || board[y][x] !== "X" ||board[y][x] !== "O") {
    const shipId = board[y][x];
    const ship = ships.find(s => s.id[0] === shipId);
    if (ship) {
      ship.hits++;
      res.json({ result: "hit" });
      if (ship.hits === ship.size) {
        res.json({ result: "destroyed" });
      }
    }
    board[y][x] = "X";
    

  } else {
    board[y][x] = "O";
    res.json({ result: "miss" });
  }
  console.log(res)
});

app.listen(PORT, () => {
  console.log(`Battleship backend running on http://localhost:${PORT}`);
});
