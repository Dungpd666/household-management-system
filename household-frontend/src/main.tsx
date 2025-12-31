import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/noto-sans/vietnamese-400.css'
import '@fontsource/noto-sans/vietnamese-500.css'
import '@fontsource/noto-sans/vietnamese-600.css'
import '@fontsource/noto-sans/vietnamese-700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
