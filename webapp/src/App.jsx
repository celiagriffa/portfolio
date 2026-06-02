import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/global.css';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    }, [menuOpen]);

    return (
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
    );
}

export default App;