import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/global.css';
import { HelmetProvider, Helmet } from 'react-helmet-async'

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    }, [menuOpen]);

    return (
        <HelmetProvider>
            <Helmet>
                <title>Celia Griffa — Photography Portfolio</title>
                <title>Celia Griffa — Concert, Fashion & Event Photographer | Milan, Italy</title>
                <meta name="description" content="Independent photographer based in Legnano, Milan. Specialized in concerts, live music, fashion and events. Available throughout Italy and abroad." />
                <meta name="keywords" content="concert photographer, fashion photographer, event photographer, Legnano Milano Italy, independent photographer" />
            </Helmet>
            <Router>
                <div className="app">
                    <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* Redirect /portfolio senza categoria alla home */}
                        <Route path="/portfolio" element={<Navigate to="/" replace />} />
                        <Route path="/portfolio/:category" element={<Portfolio />} />
                        <Route path="/portfolio/:category/:projectId" element={<ProjectDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </Router>
        </HelmetProvider>
    );
}

export default App;