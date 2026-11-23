import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Home from './Pages/Home.jsx'
import Stream from './Pages/Stream.jsx'
import Privacy from './Pages/Privacy.jsx'
import Terms from './Pages/Terms.jsx'
import NotFound from './Pages/NotFound.jsx'
import Friends from './Pages/Friends.jsx'
import DesignSystem from './Pages/DesignSystem.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'

// PWA: register the service worker (public/sw.js) so the app can be installed and opens offline.
// Only in the production build: during `npm run dev` a cache would hide your code changes.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* "*" = any other URL → 404 page (keep it LAST) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
