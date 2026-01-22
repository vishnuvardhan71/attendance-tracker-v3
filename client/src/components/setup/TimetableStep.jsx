import React, { useEffect, useState } from 'react';

const TimetableStep = ({ config, updateConfig, goToStep, handleFinish, loading }) => {
    const [timetable, setTimetable] = useState({});
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        // Initialize timetable structure
        const slots = generateTimeSlots();
        const initialTimetable = {};

        days.forEach(day => {
            initialTimetable[day] = slots.map(slot => ({
                time: slot,
                subject: ''
            }));
        });

        setTimetable(config.timetable.Monday ? config.timetable : initialTimetable);
    }, []);

    const generateTimeSlots = () => {
        const slots = [];
        const [startHour, startMin] = config.startTime.split(':').map(Number);
        const [endHour, endMin] = config.endTime.split(':').map(Number);
        const [lunchHour, lunchMin] = config.lunchStart.split(':').map(Number);

        let currentTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        const lunchTime = lunchHour * 60 + lunchMin;
        const periodDuration = Number(config.periodDuration) || 45;
        const lunchDuration = Number(config.lunchDuration) || 45;

        while (currentTime < endTime) {
            // Check if it's lunch time
            if (currentTime === lunchTime) {
                slots.push('Lunch Break');
                currentTime += lunchDuration;
            } else {
                const hour = Math.floor(currentTime / 60);
                const min = currentTime % 60;
                const nextTime = currentTime + periodDuration;
                const nextHour = Math.floor(nextTime / 60);
                const nextMin = nextTime % 60;

                slots.push(
                    `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')} - ` +
                    `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`
                );
                currentTime += periodDuration;
            }
        }

        return slots;
    };

    const handleSubjectChange = (day, slotIndex, subject) => {
        const updatedTimetable = { ...timetable };
        updatedTimetable[day][slotIndex].subject = subject;
        setTimetable(updatedTimetable);
        updateConfig({ timetable: updatedTimetable });
    };

    const handleSave = () => {
        updateConfig({ timetable });
        handleFinish();
    };

    return (
        <div>
            <h2>Step 3: Create Timetable</h2>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                Map your subjects to time slots.
            </p>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {days.map((day) => (
                    <div key={day} style={{
                        marginBottom: '20px',
                        border: '1px solid #eee',
                        padding: '15px',
                        borderRadius: '8px'
                    }}>
                        <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>{day}</h3>
                        {timetable[day]?.map((slot, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                gap: '10px',
                                marginBottom: '10px',
                                alignItems: 'center'
                            }}>
                                <label style={{
                                    width: '150px',
                                    fontSize: '12px',
                                    margin: 0
                                }}>
                                    {slot.time}
                                </label>
                                {slot.time === 'Lunch Break' ? (
                                    <span style={{ fontSize: '14px', color: '#999' }}>Lunch Break</span>
                                ) : (
                                    <select
                                        value={slot.subject}
                                        onChange={(e) => handleSubjectChange(day, index, e.target.value)}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="">-- No Class --</option>
                                        {config.subjects.map((subject, idx) => (
                                            <option key={idx} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn-secondary" onClick={() => goToStep(2)} disabled={loading}>
                    Back
                </button>
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Finish Setup'}
                </button>
            </div>
        </div>
    );
};

export default TimetableStep;
