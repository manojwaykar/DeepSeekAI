import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppContextProvider } from '../context/AppContext.jsx'
import Dashboard from './route.jsx'
import { Toaster } from 'react-hot-toast';
import './prism.css';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppContextProvider>
    <Dashboard />
    <Toaster toastOptions={{style : {background : "black", color : "white"}}}/>
    </AppContextProvider>
    </ClerkProvider>
  </StrictMode>,
)
