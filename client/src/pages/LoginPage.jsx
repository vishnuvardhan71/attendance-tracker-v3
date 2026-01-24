import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DotGrid from '../components/common/DotGrid';

const LoginPage = ({ initialIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        const result = isLogin
            ? await login(username, password)
            : await signup(username, password);

        if (result.success) {
            navigate(isLogin ? '/dashboard' : '/attendance-input');
        } else {
            setError(result.error);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="home-page auth-page">
            <div className="container auth-container">
                <div className="card auth-card">
                    <div className="card-header">
                        <h1>📚 Attendance Tracker</h1>
                        <p>Track your attendance effortlessly</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-center mb-3">{isLogin ? 'Login' : 'Sign Up'}</h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

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

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

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
