import React from 'react';
import { useNavigate } from 'react-router';
import {
  Footer,
  MenuButton,
  MenuButtons,
  MenuContainer,
  SubTitle,
  Title,
} from './styled';

export function MainMenu() {
  const navigate = useNavigate();

  return (
    <MenuContainer>
      <Title>Fungal Dominion</Title>
      <SubTitle>Grow. Adapt. Dominate.</SubTitle>
      <MenuButtons>
        <MenuButton onClick={() => navigate('/game')}>Play</MenuButton>
        <MenuButton onClick={() => navigate('/new-colony')}>New Colony</MenuButton>
        <MenuButton onClick={() => navigate('/settings')}>Settings</MenuButton>
      </MenuButtons>
      <Footer>Version 0.1.0</Footer>
    </MenuContainer>
  );
}
