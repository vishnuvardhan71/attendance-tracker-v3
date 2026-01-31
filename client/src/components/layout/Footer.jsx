import React from 'react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} AttenlyX. Mark daily, stay eligible, succeed.</p>
                <div className="footer-links">
                    <span className="footer-link-static">Privacy Policy</span>
                    <span className="footer-link-static">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
