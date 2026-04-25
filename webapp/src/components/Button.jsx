import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

function CtaButton({ to, onClick, children }) {
    const content = (
        <>
            {children}
            {/* L'icona della freccia fissa inclusa nel bottone */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </>
    );

    // Se passi una prop "to", renderizza un Link di React Router
    if (to) {
        return (
            <Link to={to} className="cta-button">
                {content}
            </Link>
        );
    }

    // Altrimenti renderizza un bottone standard (utile per i form o azioni)
    return (
        <button onClick={onClick} className="cta-button">
            {content}
        </button>
    );
}

export default CtaButton;