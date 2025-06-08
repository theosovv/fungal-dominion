import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { GameProvider } from './context/GameContext';
import { MainMenu } from './pages/MainMenu';
import { GlobalStyle } from './styles';
import { Game } from './pages/Game';

export function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<MainMenu />} />
        <Route
          path='/game'
          element={
            <GameProvider>
              <Game />
            </GameProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
