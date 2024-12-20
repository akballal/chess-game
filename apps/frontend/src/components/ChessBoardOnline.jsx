import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import './Chessboard.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

const ROW_COORDS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const COL_COORDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const ChessBoardOnline = () => {
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const gameId = urlParams.get('gameId');
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.emit('joinGame', { gameId });

    newSocket.on('init', ({ board: initialBoard, color }) => {
      setBoard(initialBoard);
      setPlayerColor(color);
    });

    newSocket.on('opponentJoined', () => {
      setOpponentJoined(true);
    });

    newSocket.on('move', ({ from, to, promotion }) => {
      chess.move({ from, to, promotion });
      setBoard(chess.board());
    });

    newSocket.on('gameOver', ({ winner }) => {
      setWinner(winner === 'Black' ? 'Black' : 'White');
    });

    newSocket.on('updateBoard', (board) => {
      console.log('Board update received:', board);
      setBoard(board); // Ensure the board state updates in the frontend
  });

    return () => {
      newSocket.disconnect();
    };
  }, [chess, gameId]);

  const handleCloseGame = () =>
  {
    navigate('/')
  }

  const handleResign = () => {
    const resignedPlayer = playerColor;
    console.log(resignedPlayer);
    socket.emit('resign', { gameId, resignedPlayer });
  };

  const handleSquareClick = (rowIndex, colIndex) => {
    const adjustedRowIndex = playerColor === 'b' ? 7 - rowIndex : rowIndex;
    const adjustedColIndex = playerColor === 'b' ? 7 - colIndex : colIndex;
    const square = `${COL_COORDS[adjustedColIndex]}${ROW_COORDS[adjustedRowIndex]}`.toLowerCase();
    const piece = board[adjustedRowIndex][adjustedColIndex];

    // Check if it's the current player's turn
  if (chess.turn() !== playerColor) {
    alert(`It's ${chess.turn() === 'w' ? 'White' : 'Black'}'s turn! Please wait for your turn.`);
    return;
  }
  
    if (selectedSquare === square) {
      // Deselect the currently selected piece
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (piece && piece.color === playerColor) {
      // Select a new piece of the same color
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true }).map((m) => m.to);
      setValidMoves(moves);
    } else if (selectedSquare) {
      // Attempt to move the currently selected piece
      const isPromotion =
        board[adjustedRowIndex][adjustedColIndex]?.type === 'p' &&
        (square[1] === '8' || square[1] === '1');
  
      const promotion = isPromotion
        ? prompt('Promote to (q/r/b/n):', 'q').toLowerCase() || 'q'
        : undefined;
  
      const move = chess.move({ from: selectedSquare, to: square, promotion });
      if (move) {
        setBoard(chess.board());
        setSelectedSquare(null);
        setValidMoves([]);
  
        socket.emit('move', {
          gameId,
          from: move.from,
          to: move.to,
          promotion: move.promotion || undefined,
        });
      } else {
        alert('Invalid move');
      }
    } else {
      alert(`You can only move ${playerColor === 'w' ? 'White' : 'Black'} pieces!`);
    }
  };
  
  

  const isValidMoveSquare = (row, col) => {
    const adjustedRowIndex = playerColor === 'b' ? 7 - row : row;
    const adjustedColIndex = playerColor === 'b' ? 7 - col : col;
    const square = `${COL_COORDS[adjustedColIndex]}${ROW_COORDS[adjustedRowIndex]}`.toLowerCase();
    return validMoves.includes(square);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId).then(() => setCopySuccess(true));
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getTransformedBoard = () =>
    playerColor === 'b'
      ? [...board].reverse().map((row) => [...row].reverse())
      : board;

  return (
    <div className="chess-board-container">
      {!opponentJoined ? (
        <div className="waiting-for-opponent">
          <h2>
            Created Game Room ID: {gameId}
            <button onClick={copyToClipboard} title="Copy Game ID">
              📋
            </button>
            {copySuccess && <span style={{ color: 'green' }}> Copied!</span>}
          </h2>
          <h2>Waiting for opponent to join...</h2>
        </div>
      ) : (
        <>
        <div className="chess-board">
          {getTransformedBoard().map((row, rowIndex) => (
            <div key={rowIndex} className="chess-row">
              {row.map((cell, colIndex) => {
                const isSelected = selectedSquare === `${COL_COORDS[colIndex]}${ROW_COORDS[rowIndex]}`;
                const isValidMove = isValidMoveSquare(rowIndex, colIndex);

                return (
                  <div
                    key={colIndex}
                    className={`chess-square ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'} ${
                      isSelected ? 'selected' : ''
                    } ${isValidMove ? 'valid-move' : ''}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {cell && cell.color && cell.type && (
                      <span className={cell.color === 'w' ? 'white-piece' : 'black-piece'}>
                        {PIECES[cell.color][cell.type]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div>
        <button onClick={handleResign}>Resign</button>
      </div></>
      )}
      
      

      {winner && (
        <div className="popup">
          <div className="popup-content">
            <h2>{winner} Wins!</h2>
            <button onClick={handleCloseGame}>Close Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoardOnline;
