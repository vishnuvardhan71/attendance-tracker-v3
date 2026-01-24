import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import StatsOverview from '../components/dashboard/StatsOverview';
import AttendanceMarker from '../components/dashboard/AttendanceMarker';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DotGrid from '../components/common/DotGrid';

const SimpleDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await attendanceService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAttendanceSaved = () => {
        loadStats();
    };

    return (
        <div className="home-page dashboard-page">
            <Header />

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '40px' }}>
                <div className="dashboard-header">
                    <h1>📊 Simple Dashboard</h1>
                    <button className="btn-danger" style={{ width: 'auto' }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <StatsOverview stats={stats} loading={loading} />

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <AttendanceMarker onAttendanceSaved={handleAttendanceSaved} />
                </div>

                <div className="card mt-2">
                    <div className="card-body text-center">
                        <button
                            className="btn-secondary"
                            onClick={() => navigate('/dashboard', {
                                state: {
                                    fromSimple: true,
                                    startDate: new Date().toLocaleDateString('en-GB')
                                }
                            })}
                        >
                            View Full Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SimpleDashboardPage;
