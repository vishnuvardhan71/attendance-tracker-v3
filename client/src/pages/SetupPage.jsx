import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { timetableService } from '../services/timetableService';
import TimingsStep from '../components/setup/TimingsStep';
import SubjectsStep from '../components/setup/SubjectsStep';
import TimetableStep from '../components/setup/TimetableStep';

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
            await timetableService.saveConfig(config);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save configuration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h1>⚙️ Setup Your Tracker</h1>
                    <p>Configure your college schedule</p>
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
    );
};

export default SetupPage;
