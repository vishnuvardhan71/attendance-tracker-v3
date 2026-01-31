import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import DotGrid from '../components/common/DotGrid';

const InitialAttendancePage = () => {
    const [attendance, setAttendance] = useState('');
    const [totalClasses, setTotalClasses] = useState('');
    const [attendedClasses, setAttendedClasses] = useState('');
    const [inputType, setInputType] = useState('percentage'); // 'percentage' or 'counts'
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalTotal = 100;
            let finalAttended = 0;

            if (inputType === 'percentage') {
                finalAttended = parseFloat(attendance);
            } else {
                finalTotal = parseInt(totalClasses);
                finalAttended = parseInt(attendedClasses);
            }

            const courseId = location.state?.courseId || localStorage.getItem('selectedCourse');
            await attendanceService.saveInitialStats(finalTotal, finalAttended, courseId);
            navigate('/setup', { state: { useSimpleDashboard: true, courseId } });
        } catch (error) {
            console.error('Failed to save initial attendance:', error);
            navigate('/setup', { state: { useSimpleDashboard: true } });
        } finally {
            setLoading(false);
        }
    };

    const handlePercentageChange = (val) => {
        setAttendance(val);
        if (val !== '') {
            setInputType('percentage');
            setTotalClasses('');
            setAttendedClasses('');
        }
    };

    const handleCountChange = (type, val) => {
        if (type === 'total') setTotalClasses(val);
        else setAttendedClasses(val);

        if (val !== '') {
            setInputType('counts');
            setAttendance('');
        }
    };

    const blockInvalidChars = (e, allowDecimal = false) => {
        const invalidChars = ['e', 'E', '+', '-'];
        if (!allowDecimal) invalidChars.push('.');
        if (invalidChars.includes(e.key)) {
            e.preventDefault();
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
                                    onChange={(e) => handlePercentageChange(e.target.value)}
                                    onKeyDown={(e) => blockInvalidChars(e, true)}
                                    placeholder="e.g. 75"
                                    min="0"
                                    max="100"
                                    required={inputType === 'percentage'}
                                    disabled={loading}
                                />
                            </div>

                            <div className="separator-container my-3">
                                <span className="separator-text">OR</span>
                            </div>

                            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Number of classes held</label>
                                    <input
                                        type="number"
                                        value={totalClasses}
                                        onChange={(e) => handleCountChange('total', e.target.value)}
                                        onKeyDown={(e) => blockInvalidChars(e, false)}
                                        placeholder="e.g. 40"
                                        min="0"
                                        required={inputType === 'counts'}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Number of classes attended</label>
                                    <input
                                        type="number"
                                        value={attendedClasses}
                                        onChange={(e) => handleCountChange('attended', e.target.value)}
                                        onKeyDown={(e) => blockInvalidChars(e, false)}
                                        placeholder="e.g. 30"
                                        min="0"
                                        max={totalClasses}
                                        required={inputType === 'counts'}
                                        disabled={loading}
                                    />
                                </div>
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
