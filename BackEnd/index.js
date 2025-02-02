const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.json());

const BOARD_SIZE = 10;

let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill("."));

app.get("/board", (req, res) => {
  res.json({ board: board.map(row => row.map(cell => (cell === "S" ? "." : cell))) });//Not showing where the ships are placed to the client
});

app.listen(PORT, () => {
  console.log(`Battleship backend running on http://localhost:${PORT}`);
});
