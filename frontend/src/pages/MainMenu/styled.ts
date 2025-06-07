import styled from 'styled-components';

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0a0a15;
  color: #e6e6e6;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #4daa57;
  text-shadow: 0 0 10px rgba(77, 170, 87, 0.5);
`;

export const SubTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: #aaaaaa;
`;

export const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
`;

export const MenuButton = styled.button`
  background-color: rgba(22, 33, 62, 0.8);
  color: #e6e6e6;
  border: 2px solid #4daa57;
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(77, 170, 87, 0.8);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(77, 170, 87, 0.3);
  }
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 1rem;
  font-size: 0.8rem;
  color: #666;
`;
