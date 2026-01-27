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

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '40px', paddingTop: '20px' }}>
                {user && (
                    <div className="welcome-section mb-4" style={{ textAlign: 'left' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>
                            Welcome <span className="text-gradient">{user}</span>!
                        </h1>
                    </div>
                )}

                {/* Title and Logout Card */}
                <div className="card mb-4" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 30px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', fontWeight: '600' }}>
                        Dashboard
                    </h2>
                    <button
                        className="btn-danger"
                        style={{ width: 'auto', padding: '10px 24px', borderRadius: '8px' }}
                        onClick={handleLogout}
                    >
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
                                <button
                                    className="btn-primary mt-2"
                                    onClick={() => navigate('/courses')}
                                >
                                    My Courses
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
