import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { timetableService } from '../services/timetableService';
import TimingsStep from '../components/setup/TimingsStep';
import SubjectsStep from '../components/setup/SubjectsStep';
import TimetableStep from '../components/setup/TimetableStep';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const SetupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [config, setConfig] = useState({
        startTime: '09:00',
        endTime: '16:30',
        periodDuration: 45,
        lunchStart: '12:45',
        lunchDuration: 45,
        subjects: [],
        timetable: {}
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchConfig = async () => {
            const courseId = location.state?.courseId || localStorage.getItem('selectedCourse');
            if (courseId) {
                setLoading(true);
                try {
                    const data = await timetableService.getConfig(courseId);
                    if (data) {
                        setConfig({
                            startTime: data.startTime || '09:00',
                            endTime: data.endTime || '16:30',
                            periodDuration: data.periodDuration || 45,
                            lunchStart: data.lunchStart || '12:45',
                            lunchDuration: data.lunchDuration || 45,
                            subjects: data.subjects || [],
                            timetable: data.timetable || {}
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch config:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchConfig();
    }, [location.state?.courseId]);

    const updateConfig = (updates) => {
        setConfig({ ...config, ...updates });
    };

    const goToStep = (step) => {
        setCurrentStep(step);
        setError('');
    };

    const handleFinish = async () => {
        setLoading(true);
        setError('');

        try {
            const courseId = location.state?.courseId || localStorage.getItem('selectedCourse');
            const dataWithCourse = { ...config, courseId };
            await timetableService.saveConfig(dataWithCourse);
            const useSimple = location.state?.useSimpleDashboard !== false; // Default to true if coming from attendance-input
            const index = location.state?.index || localStorage.getItem('selectedCourseIndex');
            navigate(useSimple ? `/simple-dashboard/${index}` : `/dashboard/${index}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page setup-page">
            <Header />

            {/* Header extension visually connected to main header */}
            <div className="header-extension">
                <div className="header-extension-container">
                    <h1 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: '700' }}>Setup Your Tracker</h1>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Step {currentStep} of 3</p>
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '40px' }}>
                <div className="card" style={{ maxWidth: currentStep === 3 ? '1000px' : '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <h2>
                            {currentStep === 1 ? 'College Timings' :
                                currentStep === 2 ? 'Add Subjects' :
                                    'Create Timetable'}
                        </h2>
                    </div>
                    <div className="card-body">
                        {/* Step Indicator */}
                        <div className="step-indicator">
                            <div className={`step-dot ${currentStep >= 1 ? 'active' : ''}`}></div>
                            <div className={`step-dot ${currentStep >= 2 ? 'active' : ''}`}></div>
                            <div className={`step-dot ${currentStep >= 3 ? 'active' : ''}`}></div>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <TimingsStep
                                config={config}
                                updateConfig={updateConfig}
                                goToStep={goToStep}
                            />
                        )}

                        {currentStep === 2 && (
                            <SubjectsStep
                                config={config}
                                updateConfig={updateConfig}
                                goToStep={goToStep}
                            />
                        )}

                        {currentStep === 3 && (
                            <TimetableStep
                                config={config}
                                updateConfig={updateConfig}
                                goToStep={goToStep}
                                handleFinish={handleFinish}
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SetupPage;
