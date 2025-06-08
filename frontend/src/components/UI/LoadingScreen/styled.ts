import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(0.8); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0a0a15;
  color: #e6e6e6;
`;

export const LoadingIcon = styled.div`
  width: 80px;
  height: 80px;
  border: 5px solid rgba(77, 170, 87, 0.3);
  border-radius: 50%;
  border-top: 5px solid #4daa57;
  animation: ${spin} 1.5s linear infinite;
  margin-bottom: 20px;
`;

export const LoadingText = styled.div`
  font-size: 1.5rem;
  color: #4daa57;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const LoadingMessage = styled.div`
  font-size: 1rem;
  color: #aaa;
  margin-top: 10px;
`;
