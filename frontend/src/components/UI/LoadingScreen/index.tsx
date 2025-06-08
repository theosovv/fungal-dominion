import React from 'react';
import { LoadingContainer, LoadingIcon, LoadingMessage, LoadingText } from './styled';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: Props) {
  return (
    <LoadingContainer>
      <LoadingIcon />
      <LoadingText>Fungal Dominion</LoadingText>
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  );
}
