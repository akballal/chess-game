import React, { useState } from 'react';
import { Chess } from 'chess.js';
import './Chessboard.css';
import { useLocation } from 'react-router-dom';

const PIECES = {
  w: {
    k: '♔', q: '♕', r: '♖',
    b: '♗', n: '♘', p: '♙',
  },
  b: {
    k: '♚', q: '♛', r: '♜',
    b: '♝', n: '♞', p: '♟',
  },
};

const ROW_COORDS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const COL_COORDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const ChessBoardOffline = () => {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);

  // Get player names from the URL query parameters
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const whitePlayer = urlParams.get('whitePlayer');
  const blackPlayer = urlParams.get('blackPlayer');

  const handleSquareClick = (rowIndex, colIndex) => {
    const square = `${COL_COORDS[colIndex]}${ROW_COORDS[rowIndex]}`.toLowerCase();
    const piece = board[rowIndex][colIndex];

    if (selectedSquare === square) {
      // Unselect the square if clicked again
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (selectedSquare) {
      // Attempt to make a move
      const move = chess.move({ from: selectedSquare.toLowerCase(), to: square });
      if (move) {
        setBoard(chess.board());
        setSelectedSquare(null);
        setValidMoves([]);

        // Check for game over
        if (chess.isCheckmate()) {
          const winnerName = chess.turn() === 'w' ? blackPlayer : whitePlayer; // Opponent of the current turn wins
          setWinner(winnerName); // Set the winner based on player names
        }
      } else {
        alert('Invalid move');
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece) {
      // Restrict selection to the current player's pieces
if (piece.color !== chess.turn()) {
  const currentPlayer = chess.turn() === 'w' ? whitePlayer : blackPlayer;
  alert(`It's ${currentPlayer}'s turn!`);
  return;
}

      // Highlight valid moves
      const moves = chess.moves({ square, verbose: true }).map((m) => m.to);
      setSelectedSquare(square);
      setValidMoves(moves);
    }
  };

  const isValidMoveSquare = (row, col) => {
    const square = `${COL_COORDS[col]}${ROW_COORDS[row]}`.toLowerCase();
    return validMoves.includes(square);
  };

  return (
    <div className="chess-board-container">
      <div className="chess-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="chess-row">
            {row.map((cell, colIndex) => {
              const square = `${COL_COORDS[colIndex]}${ROW_COORDS[rowIndex]}`;
              const isSelected = selectedSquare === square;
              const isValidMove = isValidMoveSquare(rowIndex, colIndex);

              return (
                <div
                  key={colIndex}
                  className={`chess-square 
                    ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}
                    ${isSelected ? 'selected' : ''} 
                    ${isValidMove ? 'valid-move' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {cell && cell.color && cell.type ? (
                    <span className={cell.color === 'w' ? 'white-piece' : 'black-piece'}>
                      {PIECES[cell.color][cell.type]}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {winner && (
        <div className="popup">
          <div className="popup-content">
            <h2>{winner} Wins!</h2>
            <button onClick={() => window.location.reload()}>Restart Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoardOffline;
