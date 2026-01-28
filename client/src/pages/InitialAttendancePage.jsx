import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import DotGrid from '../components/common/DotGrid';

const InitialAttendancePage = () => {
    const [attendance, setAttendance] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Treat percentage as attended classes out of 100 base classes
            // This allows it to be averaged correctly with future data.
            const percentage = parseFloat(attendance);
            const courseId = location.state?.courseId || localStorage.getItem('selectedCourse');
            await attendanceService.saveInitialStats(100, percentage, courseId);
            navigate('/setup', { state: { useSimpleDashboard: true, courseId } });
        } catch (error) {
            console.error('Failed to save initial attendance:', error);
            // Even if it fails, let's allow them to continue to setup
            navigate('/setup', { state: { useSimpleDashboard: true } });
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        const courseId = location.state?.courseId || localStorage.getItem('selectedCourse');
        navigate('/setup', { state: { useSimpleDashboard: false, courseId } });
    };

    return (
        <div className="home-page auth-page">
            <div className="container auth-container">
                <div className="card auth-card">
                    <div className="card-header">
                        <h1>Welcome!</h1>
                        <p>Let's get started with your attendance</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>What is your current overall attendance percentage?</label>
                                <input
                                    type="number"
                                    value={attendance}
                                    onChange={(e) => setAttendance(e.target.value)}
                                    placeholder="e.g. 75"
                                    min="0"
                                    max="100"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : 'Next: Setup Timetable'}
                            </button>
                        </form>
                        <button
                            className="btn-secondary mt-3"
                            onClick={handleSkip}
                            disabled={loading}
                        >
                            Skip & Use Normal Dashboard
                        </button>
                        <p className="text-center mt-3" style={{ fontSize: '12px', color: '#94a3b8' }}>
                            * Skipping will take you to the full dashboard instead of the simplified view.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialAttendancePage;
