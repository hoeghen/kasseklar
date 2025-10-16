import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { YearProvider } from './context/YearContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <YearProvider>
      <App />
    </YearProvider>
  </StrictMode>,
)
