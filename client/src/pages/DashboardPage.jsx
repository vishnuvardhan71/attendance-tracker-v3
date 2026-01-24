import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import StatsOverview from '../components/dashboard/StatsOverview';
import AttendanceMarker from '../components/dashboard/AttendanceMarker';
import SubjectStats from '../components/dashboard/SubjectStats';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const fromSimple = location.state?.fromSimple;
    const startDate = location.state?.startDate;

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
        loadStats(); // Reload stats after attendance is saved
    };

    return (
        <div className="home-page dashboard-page">
            <Header />

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '40px' }}>
                {fromSimple && (
                    <div className="alert alert-success text-center mb-4" style={{
                        background: 'rgba(79, 70, 229, 0.15)',
                        border: '1px solid rgba(79, 70, 229, 0.3)',
                        color: 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        backdropFilter: 'blur(8px)'
                    }}>
                        Welcome <strong>{user}</strong>! You are marking attendance from <strong>{startDate}</strong>.
                    </div>
                )}
                {/* Dashboard Header */}
                <div className="dashboard-header">
                    <h1>📊 Dashboard</h1>
                    <button className="btn-danger" style={{ width: 'auto' }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Statistics Overview */}
                <StatsOverview stats={stats} loading={loading} />

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Left Column: Mark Attendance */}
                    <AttendanceMarker onAttendanceSaved={handleAttendanceSaved} />

                    {/* Right Column: Subject Stats */}
                    <div>
                        <SubjectStats stats={stats} loading={loading} />
                        <div className="card mt-2">
                            <div className="card-body text-center">
                                <button
                                    className="btn-secondary"
                                    onClick={() => navigate('/setup')}
                                >
                                    Edit Timetable
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardPage;
