import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [whitePlayer, setWhitePlayer] = useState('');
  const [blackPlayer, setBlackPlayer] = useState('');
  const navigate = useNavigate();

  const handleStartOfflineGame = () => {
    if (whitePlayer && blackPlayer) {
      navigate(`/chessboardoffline?whitePlayer=${whitePlayer}&blackPlayer=${blackPlayer}`);
    } else {
      alert('Please enter both player names!');
    }
  };

  const handlePlayOnline = () => {
    navigate('/onlinesetup'); // Navigate to the online setup page
  };

  return (
    <div className="home-container">
      <h1>Welcome to Chess</h1>
      <p>Choose your game mode and start playing now!</p>

      <div className="game-mode-container">
        <div className="offline-mode">
          <h2>Play Offline</h2>
          <p>Enter player names and play locally on this device.</p>
          <div className="input-container">
            <div>
              <label>Player 1 (White):</label>
              <input
                type="text"
                value={whitePlayer}
                onChange={(e) => setWhitePlayer(e.target.value)}
                placeholder="Enter White player name"
              />
            </div>
            <div>
              <label>Player 2 (Black):</label>
              <input
                type="text"
                value={blackPlayer}
                onChange={(e) => setBlackPlayer(e.target.value)}
                placeholder="Enter Black player name"
              />
            </div>
          </div>
          <button onClick={handleStartOfflineGame} className="play-btn">
            Start Offline Game
          </button>
        </div>

        <div className="online-mode">
          <h2>Play Online</h2>
          <p>Join or create an online game room to play with friends.</p>
          <button onClick={handlePlayOnline} className="play-btn">
            Play Online
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
