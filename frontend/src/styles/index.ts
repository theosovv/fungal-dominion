/* eslint-disable max-len */
import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    padding: 0;
    margin: 0;
    font-family: 'Roboto', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0a0a15;
  color: #e6e6e6;
  overflow: hidden;
  }

  h1, h2, h3, h4, h5, h6, p, a {
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #16213e;
  }

  ::-webkit-scrollbar-thumb {
    background: #4daa57;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #3c8a46;
  }

  button, input, select {
    font-family: inherit;
  }

  a {
    color: #4daa57;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    background-color: rgba(22, 33, 62, 0.5);
    padding: 2px 4px;
    border-radius: 3px;
  }
`;
