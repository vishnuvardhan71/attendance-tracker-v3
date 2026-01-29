import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DotGrid from '../components/common/DotGrid';

const LoginPage = ({ initialIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!username || !password || (!isLogin && (!email || !fullName || !confirmPassword))) {
            setError('Please fill in all fields');
            return;
        }

        const result = isLogin
            ? await login(username, password)
            : await signup(username, password, email, fullName);

        if (result.success) {
            navigate(isLogin ? '/courses' : '/courses');
        } else {
            setError(result.error);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setFullName('');
    };

    return (
        <div className="home-page auth-page">
            <div className="container auth-container">
                <div className="card auth-card">
                    <div className="card-header">
                        <h1>Attendance Tracker</h1>
                        <p>Track your attendance effortlessly</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-center mb-3">{isLogin ? 'Login' : 'Sign Up'}</h2>



                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {!isLogin && (
                                <>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder="Enter your password"
                                />
                                {isLogin && (
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? "👁️‍🗨️" : "👁️"}
                                    </button>
                                )}
                                {!isLogin && (
                                    <small className="form-text text-muted" style={{ color: '#aaa', fontSize: '0.8rem' }}>
                                        Must be at least 6 characters.
                                    </small>
                                )}
                            </div>

                            {!isLogin && (
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                    border: '1px solid #ef4444',
                                    color: '#f87171',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    fontWeight: '600',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                            </button>

                            <p className="text-center mt-3">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <a onClick={toggleForm}>
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
