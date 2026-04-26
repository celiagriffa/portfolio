import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/global.css';

function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    // Prevent scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : 'unset';
    }, [menuOpen]);

    return (
        <Router>
            <div className="app">
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
                    <Route path="/about" element={<About />}/>
                    <Route path="/contact" element={<Contact />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;