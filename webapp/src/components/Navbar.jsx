import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../data/driveAPI';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/about',   label: 'About' },
    { to: '/contact', label: 'Contact' },
];

function IconInstagram() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

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
    const navigate = useNavigate();
    const { categories } = useCategories();
    const isHomePage = location.pathname === '/';

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [drawerWorkOpen, setDrawerWorkOpen] = useState(false);
    const closeTimer = useRef(null);

    const isWorkActive = location.pathname.startsWith('/portfolio');
    const navbarClasses = `navbar ${!isHomePage || menuOpen ? 'navbar--solid' : ''}`;

    const openDropdown = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setDropdownOpen(true);
    };

    const closeDropdown = () => {
        closeTimer.current = setTimeout(() => setDropdownOpen(false), 120);
    };

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
        setDrawerWorkOpen(false);
    }, [location, setMenuOpen]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const handleCategoryClick = (categoryName) => {
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate(`/portfolio/${encodeURIComponent(categoryName)}`);
    };

    return (
        <>
            <nav className={navbarClasses}>

                <Link to="/" className="navbar__logo">
                    <span className="navbar__logo-main">cmgriffa</span>
                    <span className="navbar__logo-sub">Photography</span>
                </Link>

                <ul className="navbar__links">
                    <li className="navbar__item--dropdown">
                        <button
                            className={`navbar__link navbar__link--btn ${isWorkActive ? 'navbar__link--active' : ''}`}
                            onMouseEnter={openDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            Work
                            <span className={`navbar__chevron ${dropdownOpen ? 'navbar__chevron--open' : ''}`} />
                        </button>

                        <div
                            className={`navbar__dropdown ${dropdownOpen ? 'navbar__dropdown--open' : ''}`}
                            onMouseEnter={openDropdown}
                            onMouseLeave={closeDropdown}
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`navbar__dropdown-item ${
                                        location.pathname === `/portfolio/${encodeURIComponent(cat.name)}`
                                            ? 'navbar__dropdown-item--active'
                                            : ''
                                    }`}
                                    onClick={() => handleCategoryClick(cat.name)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </li>

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

                <div className="navbar__social">
                    <a href="https://www.instagram.com/cmgriffaph/" target="_blank" rel="noopener noreferrer"
                       className="navbar__social-link" aria-label="Instagram">
                        <IconInstagram />
                    </a>
                    <a href="mailto:celia.griffa@gmail.com" className="navbar__social-link" aria-label="Email">
                        <IconMail />
                    </a>
                </div>

                <button
                    className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </nav>

            <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
                <ul className="navbar__drawer-links">
                    <li className="navbar__drawer-item--accordion">
                        <button
                            className={`navbar__drawer-link navbar__drawer-link--btn ${isWorkActive ? 'navbar__drawer-link--active' : ''}`}
                            onClick={() => setDrawerWorkOpen((v) => !v)}
                            aria-expanded={drawerWorkOpen}
                        >
                            Work
                            <span className={`navbar__chevron ${drawerWorkOpen ? 'navbar__chevron--open' : ''}`} />
                        </button>

                        <ul className={`navbar__drawer-categories ${drawerWorkOpen ? 'navbar__drawer-categories--open' : ''}`}>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        className={`navbar__drawer-category-item ${
                                            location.pathname === `/portfolio/${encodeURIComponent(cat.name)}`
                                                ? 'navbar__drawer-category-item--active'
                                                : ''
                                        }`}
                                        onClick={() => handleCategoryClick(cat.name)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {NAV_LINKS.map(({ to, label }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`navbar__drawer-link ${location.pathname === to ? 'navbar__drawer-link--active' : ''}`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="navbar__drawer-divider" />

                <div className="navbar__drawer-social">
                    <a href="https://www.instagram.com/cmgriffaph/" target="_blank" rel="noopener noreferrer"
                       className="navbar__drawer-social-link" aria-label="Instagram">
                        <IconInstagram />
                    </a>
                    <a href="mailto:celia.griffa@gmail.com" className="navbar__drawer-social-link" aria-label="Email">
                        <IconMail />
                    </a>
                </div>
            </div>
        </>
    );
}

export default Navbar;