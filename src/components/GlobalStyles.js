import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #00bcd4;
    --color-text: #333;
    --color-background: #fff;
    --color-background-offset: #f1f1f1;
    --color-border: #ccc;
  }

  body {
    font-family: sans-serif;
    margin: 0;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  body.dark-theme {
    --color-primary: #00bcd4;
    --color-text: #e0e0e0;
    --color-background: #121212;
    --color-background-offset: #1e1e1e;
    --color-border: #444;
  }

  * {
    box-sizing: border-box;
  }
`;
