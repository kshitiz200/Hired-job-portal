import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { dark } from '@clerk/themes'

createRoot(document.getElementById('root')).render(
    <ClerkProvider
        appearance={{
            theme: [dark],
        }}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <StrictMode>
            <App />
        </StrictMode>
    </ClerkProvider>,
)
