import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DotGrid from '../components/common/DotGrid';

const HomePage = () => {
    const [typedText, setTypedText] = useState('');
    const fullText = "Mark daily, stay eligible, succeed with AttendIt.";
    const navigate = useNavigate();

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div className="home-page">
            <div className="background-container">
                <DotGrid
                    dotSize={3}
                    gap={40}
                    baseColor="#1e1e2e"
                    activeColor="#ffffff"
                    proximity={100}
                    shockRadius={200}
                    shockStrength={3}
                    resistance={900}
                    returnDuration={2}
                />
            </div>

            <Header />

            <main className="hero-section">
                <div className="hero-content">
                    <h1 className="brand-name">AttendIt</h1>
                    <p className="typing-effect">{typedText}<span className="cursor">|</span></p>

                    <div className="cta-buttons">
                        <button
                            className="btn-primary login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className="btn-outline signup-btn"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
