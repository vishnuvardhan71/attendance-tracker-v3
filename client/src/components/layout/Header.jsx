import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Determine where "Attendly" logo should navigate
    const logoDestination = isAuthenticated ? '/courses' : '/';

    // Check if we're on the guide page
    const isGuidePage = location.pathname === '/guide';

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    {isGuidePage ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="header-back-btn"
                        >
                            ← Back
                        </button>
                    ) : (
                        <Link to={logoDestination}>
                            <span className="logo-text">Attendly</span>
                        </Link>
                    )}
                </div>
                <nav className="nav-links">
                    {!isGuidePage && (
                        <Link to="/guide" className="nav-btn guide-btn">How to Use</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
