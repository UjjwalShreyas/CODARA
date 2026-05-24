import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/shared/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Features from './pages/Features'
import HowItWorks from './pages/HowItWorks'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Disclaimer from './pages/Disclaimer'
import './styles/components.css'

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="app-container">
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/analyze" element={<Analyze style={{ paddingTop: '80px' }} />} />
              <Route path="/results" element={<Results style={{ paddingTop: '80px' }} />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  )
}

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '8rem 0' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
        Back Home
      </a>
    </div>
  )
}