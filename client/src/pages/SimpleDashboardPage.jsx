import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { courseService } from '../services/courseService';
import StatsOverview from '../components/dashboard/StatsOverview';
import AttendanceMarker from '../components/dashboard/AttendanceMarker';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SimpleDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { index } = useParams();

    useEffect(() => {
        const fetchCourseAndStats = async () => {
            try {
                const courses = await courseService.getCourses();
                const course = courses.find(c => c.index === parseInt(index));

                if (!course) {
                    navigate('/courses');
                    return;
                }

                setCurrentCourse(course);
                localStorage.setItem('selectedCourse', course._id);
                localStorage.setItem('selectedCourseIndex', course.index);

                const data = await attendanceService.getStats(course._id);
                setStats(data);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndStats();
    }, [index, navigate]);

    const loadStats = async () => {
        if (!currentCourse) return;
        try {
            const data = await attendanceService.getStats(currentCourse._id);
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
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
                        Simple Dashboard - {currentCourse?.name || ''}
                    </h2>
                    <button
                        className="btn-danger"
                        style={{ width: 'auto', padding: '10px 24px', borderRadius: '8px' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <StatsOverview stats={stats} loading={loading} />

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <AttendanceMarker onAttendanceSaved={handleAttendanceSaved} courseId={currentCourse?._id} />
                </div>

                <div className="card mt-2">
                    <div className="card-body text-center">
                        <button
                            className="btn-secondary"
                            onClick={() => navigate(`/dashboard/${index}`, {
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
