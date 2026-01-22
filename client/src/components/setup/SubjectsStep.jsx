import React, { useState } from 'react';

const SubjectsStep = ({ config, updateConfig, goToStep }) => {
    const [subjectInput, setSubjectInput] = useState('');

    const addSubject = () => {
        if (subjectInput.trim() && !config.subjects.includes(subjectInput.trim())) {
            updateConfig({ subjects: [...config.subjects, subjectInput.trim()] });
            setSubjectInput('');
        }
    };

    const removeSubject = (subject) => {
        updateConfig({
            subjects: config.subjects.filter(s => s !== subject)
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubject();
        }
    };

    return (
        <div>
            <h2>Step 2: Add Subjects</h2>

            <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="btn-secondary"
                    onClick={addSubject}
                    style={{ width: 'auto', padding: '12px 24px' }}
                >
                    Add
                </button>
            </div>

            <div className="subject-list">
                {config.subjects.map((subject, index) => (
                    <div key={index} className="subject-tag">
                        {subject}
                        <button onClick={() => removeSubject(subject)}>×</button>
                    </div>
                ))}
            </div>

            {config.subjects.length === 0 && (
                <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
                    No subjects added yet. Add at least one subject to continue.
                </p>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn-secondary" onClick={() => goToStep(1)}>
                    Back
                </button>
                <button
                    className="btn-primary"
                    onClick={() => goToStep(3)}
                    disabled={config.subjects.length === 0}
                >
                    Next: Set Timetable
                </button>
            </div>
        </div>
    );
};

export default SubjectsStep;
