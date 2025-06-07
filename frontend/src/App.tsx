import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { GameProvider } from './context/GameContext';
import { MainMenu } from './pages/MainMenu';
import { GlobalStyle } from './styles';

export function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<MainMenu />} />
      </Routes>
    </BrowserRouter>
  );
}
