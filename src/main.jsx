import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/reset.css'
import './styles/variables.css'
import './styles/typography.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/responsive.css'
import './styles/accessibility.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// Wait for DOM to be ready
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render with error handling
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Register service worker for offline capabilities
serviceWorkerRegistration.register();