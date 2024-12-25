import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChessboardOffline from './components/ChessboardOffline'
import OnlineSetup from './components/OnlineSetup';
import ChessBoardOnline from './components/ChessBoardOnline';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chessboardoffline" element={<ChessboardOffline />} />
        <Route path="/onlinesetup" element={<OnlineSetup />} />
        <Route path="/chessboardonline" element={<ChessBoardOnline />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
