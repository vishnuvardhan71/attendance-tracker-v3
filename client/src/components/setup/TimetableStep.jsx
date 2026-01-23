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
        if (!config.startTime || !config.endTime || !config.lunchStart) {
            return [];
        }

        const [startHour, startMin] = config.startTime.split(':').map(val => parseInt(val) || 0);
        const [endHour, endMin] = config.endTime.split(':').map(val => parseInt(val) || 0);
        const [lunchHour, lunchMin] = config.lunchStart.split(':').map(val => parseInt(val) || 0);

        let currentTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        const lunchTime = lunchHour * 60 + lunchMin;
        const periodDuration = parseInt(config.periodDuration) || 45;
        const lunchDuration = parseInt(config.lunchDuration) || 45;

        // Prevent infinite loops or invalid ranges
        if (endTime <= currentTime || periodDuration <= 0) {
            return [];
        }

        let safetyCounter = 0;
        while (currentTime < endTime && safetyCounter < 50) {
            safetyCounter++;
            // Check if it's lunch time
            if (currentTime === lunchTime) {
                slots.push('Lunch Break');
                currentTime += lunchDuration;
            } else {
                const hour = Math.floor(currentTime / 60);
                const min = currentTime % 60;
                const nextTime = currentTime + periodDuration;

                // Don't let a period extend past the end time or lunch start abruptly if not aligned
                // but for now, just calculate next slot
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
        setTimetable(prev => {
            if (!prev[day] || !prev[day][slotIndex]) return prev;
            const updatedDay = [...prev[day]];
            updatedDay[slotIndex] = { ...updatedDay[slotIndex], subject };
            const updatedTimetable = { ...prev, [day]: updatedDay };
            updateConfig({ timetable: updatedTimetable });
            return updatedTimetable;
        });
    };

    const handleSave = () => {
        updateConfig({ timetable });
        handleFinish();
    };

    return (
        <div>
            <h2>Step 3: Create Timetable</h2>
            <p className="setup-info-text">
                Map your subjects to time slots.
            </p>

            <div className="timetable-scroll-area">
                {days.map((day) => (
                    <div key={day} className="day-setup-card">
                        <h3 className="day-setup-title">{day}</h3>
                        {timetable[day]?.map((slot, index) => (
                            <div key={index} className="slot-setup-row">
                                <label className="slot-setup-label">
                                    {slot.time}
                                </label>
                                {slot.time === 'Lunch Break' ? (
                                    <span className="lunch-break-text">Lunch Break</span>
                                ) : (
                                    <select
                                        className="slot-setup-select"
                                        value={slot.subject}
                                        onChange={(e) => handleSubjectChange(day, index, e.target.value)}
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

            <div className="setup-actions">
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
