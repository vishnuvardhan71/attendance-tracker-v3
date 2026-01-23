import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import InitialAttendancePage from './pages/InitialAttendancePage';
import SetupPage from './pages/SetupPage';
import DashboardPage from './pages/DashboardPage';
import SimpleDashboardPage from './pages/SimpleDashboardPage';
import './styles/main.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/attendance-input"
                        element={
                            <PrivateRoute>
                                <InitialAttendancePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/setup"
                        element={
                            <PrivateRoute>
                                <SetupPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/simple-dashboard"
                        element={
                            <PrivateRoute>
                                <SimpleDashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
