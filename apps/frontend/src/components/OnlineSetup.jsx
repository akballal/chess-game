import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnlineSetup.css';

const OnlineSetup = () => {
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  const handleCreateGameRoom = () => {
    const newGameId = `game_${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/chessboardonline?gameId=${newGameId}&join=false`);
  };

  const handleJoinGameRoom = () => {
    if (!gameId.trim()) {
      alert('Please enter a valid Game ID!');
      return;
    }
    console.log("join game, game id => ", gameId);
    navigate(`/chessboardonline?gameId=${gameId}&join=true`);
  };

  return (
    <div className="online-setup-container">
      <h1 className="heading">Online Chess Setup</h1>
      <div className="card">
        <button className="play-btn create-btn" onClick={handleCreateGameRoom}>
          Create New Game Room
        </button>
        
        {/* Join Game Room Section */}
        <div className="join-container">
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="game-id-input"
            placeholder="Enter Game ID to Join"
          />
          <button className="play-btn join-btn" onClick={handleJoinGameRoom}>
            Join Game Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineSetup;
