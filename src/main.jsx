import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext'; // Need specific provider access or wrapping inside

// We need AuthContext for the fallback, so we put ErrorBoundary INSIDE AuthProvider in App normally, 
// OR we just make a simple reload for the outer one. 
// Actually simpler: Let's assume the fallback in ErrorBoundary might need Auth, but if Auth fails we can just window.location.reload().
// Let's modify the plan: Put ErrorBoundary inside App.jsx where providers are.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
