import { useState, useEffect } from 'react'
import './App.css'
import { ButtonGroup, Container } from 'react-bootstrap';
import GridRow from './GridRow';

function App() {
  const [board, setBoard] = useState([[""]]);
  const [message, setMessage] = useState("");
  const [gameId, setGameId] = useState("");


  useEffect(() => {
    const startNewGame = async () => {
      const res = await fetch("http://localhost:3000/new-game", { method: "GET" });
      const data = await res.json();
      setGameId(data.gameId);
      getBoard(data.gameId);
    };
    startNewGame();
  }, []);

  function getBoard(gameId: string) {
    fetch(`http://localhost:3000/board/${gameId}`)
      .then((res) => res.json())
      .then((data) => setBoard(data.board));
  }

  const handleAttack = async (x: number, y: number) => {
    const res = await fetch("http://localhost:3000/attack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, x, y })
    });
    const data = await res.json();
    setMessage(`Attack at (${x}, ${y}): ${data.result}`);
    setBoard((prevBoard: string[][]) => {
      const newBoard: string[][] = prevBoard.map(row => [...row]);
      newBoard[y][x] = data.result === "hit" || data.result === "destroyed" ? "X" : "O";
      return newBoard;
    });
  };

  return (
    <>
      <div>
        <h1>Battleship Game</h1>
        <Container className="d-grid gap-2">
          <ButtonGroup vertical >
            {
              board.map((row, y) => (
                <GridRow y={y} row={row} handleAttack={handleAttack} />


              ))}
          </ButtonGroup>
        </Container>
        {message && <p>{message}</p>}
      </div>
    </>
  )
}

export default App
