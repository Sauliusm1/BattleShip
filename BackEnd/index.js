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
let maxIter = 1000;
let iter = 0;
function placeShips() {
  iter = 0;
  for (let ship of SHIPS) {
    let placed = false;
    while (!placed) {
      let x = Math.floor(Math.random() * BOARD_SIZE);
      let y = Math.floor(Math.random() * BOARD_SIZE);
      let horizontal = Math.random() > 0.5;
      
      if (canPlaceShip(x, y, ship.size, horizontal)) {
        addShip(x, y, ship.size, horizontal);
        ships.push({ ...ship, hits: 0 });
        placed = true;

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
  if(ships.length <= 0){
    placeShips();
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
      if( board[y+size][x]!==".") return false;
      if(x-1 > -1 && board[y+size][x-1]!==".") return false;
      if(x+1 < BOARD_SIZE && board[y+size][x+1]!==".") return false;
    }
  }
  return true;
}

function addShip(x, y, size, horizontal) {
  for (let i = 0; i < size; i++) {
    if (horizontal) {
      board[y][x + i] = "S";
    } else {
      board[y + i][x] = "S";
    }
  }
}

app.get("/board", (req, res) => {
  placeShips();
  res.json({ board: board.map(row => row.map(cell => (cell === "S" ? "." : cell))) });//Not showing where the ships are placed to the client
});

app.listen(PORT, () => {
  console.log(`Battleship backend running on http://localhost:${PORT}`);
});
