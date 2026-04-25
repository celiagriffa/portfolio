import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/portfolio', label: 'Work' },
    { to: '/about',     label: 'About' },
    { to: '/contact',   label: 'Contact' },
];

/* ── Icona Instagram ────────────────────────── */
function IconInstagram() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

/* ── Icona Email ────────────────────────────── */
function IconMail() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 6l10 7 10-7" />
        </svg>
    );
}

function Navbar({ menuOpen, setMenuOpen }) {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navbarClasses = `navbar ${!isHomePage ? 'navbar--solid' : ''} `;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location, setMenuOpen]);

    return (
        <>
            <nav className={navbarClasses}>

                {/* Logo — sinistra */}
                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-main">cmgriffa</span>
                    <span className="navbar__logo-sub">Photography</span>
                </Link>

                {/* Link — centro (assoluto) */}
                <ul className="navbar__links">
                    {NAV_LINKS.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Social — destra */}
                <div className="navbar__social">
                    <a
                        href="https://www.instagram.com/cmgriffaph/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="navbar__social-link"
                        aria-label="Instagram"
                    >
                        <IconInstagram />
                    </a>
                    <a
                        href="mailto:celia.griffa@gmail.com"
                        className="navbar__social-link"
                        aria-label="Email"
                    >
                        <IconMail />
                    </a>
                </div>

                {/* Hamburger mobile */}
                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>
        </>
    );
}

export default Navbar;