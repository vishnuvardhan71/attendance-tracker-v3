import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import StatsOverview from '../components/dashboard/StatsOverview';
import AttendanceMarker from '../components/dashboard/AttendanceMarker';
import SubjectStats from '../components/dashboard/SubjectStats';

const DashboardPage = () => {
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
        loadStats(); // Reload stats after attendance is saved
    };

    return (
        <div className="container">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1 style={{ color: 'white', fontSize: '24px' }}>📊 Dashboard</h1>
                <button className="btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {/* Statistics Overview */}
            <StatsOverview stats={stats} loading={loading} />

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Left Column: Mark Attendance */}
                <AttendanceMarker onAttendanceSaved={handleAttendanceSaved} />

                {/* Right Column: Subject Stats */}
                <div>
                    <SubjectStats stats={stats} loading={loading} />
                    <div className="card" style={{ marginTop: '20px' }}>
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
    );
};

export default DashboardPage;
