import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-text">Attendly</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
