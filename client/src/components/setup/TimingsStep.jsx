import React from 'react';

const TimingsStep = ({ config, updateConfig, goToStep }) => {
    const handleChange = (field, value) => {
        updateConfig({ [field]: value });
    };

    return (
        <div>
            <h2>Step 1: College Timings</h2>

            <div className="form-group">
                <label>College Start Time</label>
                <input
                    type="time"
                    value={config.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>College End Time</label>
                <input
                    type="time"
                    value={config.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Period Duration (minutes)</label>
                <input
                    type="number"
                    value={config.periodDuration}
                    onChange={(e) => handleChange('periodDuration', parseInt(e.target.value) || 0)}
                />
            </div>

            <div className="form-group">
                <label>Lunch Break Start Time</label>
                <input
                    type="time"
                    value={config.lunchStart}
                    onChange={(e) => handleChange('lunchStart', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Lunch Break Duration (minutes)</label>
                <input
                    type="number"
                    value={config.lunchDuration}
                    onChange={(e) => handleChange('lunchDuration', parseInt(e.target.value) || 0)}
                />
            </div>

            <button className="btn-primary" onClick={() => goToStep(2)}>
                Next: Set Subjects
            </button>
        </div>
    );
};

export default TimingsStep;
