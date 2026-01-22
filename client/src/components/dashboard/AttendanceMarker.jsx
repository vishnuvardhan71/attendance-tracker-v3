import React, { useState, useEffect } from 'react';
import { timetableService } from '../../services/timetableService';
import { attendanceService } from '../../services/attendanceService';

const AttendanceMarker = ({ onAttendanceSaved }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [isHoliday, setIsHoliday] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadTimetable();
    }, [date]);

    const loadTimetable = async () => {
        try {
            const data = await timetableService.getTimetable(date);
            setSlots(data.slots || []);

            // Load existing attendance if any
            try {
                const existingAttendance = await attendanceService.getAttendance(date);
                if (existingAttendance && existingAttendance.records) {
                    setIsHoliday(existingAttendance.isHoliday || false);
                    const attendanceMap = {};
                    existingAttendance.records.forEach((record, index) => {
                        attendanceMap[index] = record.status;
                    });
                    setAttendance(attendanceMap);
                }
            } catch (err) {
                // No existing attendance, that's fine
                console.log('No existing attendance for this date');
            }
        } catch (error) {
            console.error('Failed to load timetable:', error);
        }
    };

    const markAttendance = (slotIndex, status) => {
        setAttendance({ ...attendance, [slotIndex]: status });
    };

    const toggleHoliday = () => {
        setIsHoliday(!isHoliday);
        if (!isHoliday) {
            setAttendance({});
        }
    };

    const saveAttendance = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Convert attendance map to slots array with proper format
            const attendanceSlots = slots.map((slot, index) => ({
                time: slot.time,
                subject: slot.subject,
                status: attendance[index] || 'Absent'
            }));

            await attendanceService.markAttendance(date, attendanceSlots, isHoliday);
            setMessage('Attendance saved successfully!');
            onAttendanceSaved();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Mark Attendance</h3>
            </div>
            <div className="card-body">
                <div className="form-group">
                    <label>Select Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="checkbox-wrapper mb-3" style={{
                    background: '#fff3cd',
                    padding: '10px',
                    borderRadius: '8px'
                }}>
                    <input
                        type="checkbox"
                        id="holidayCheck"
                        checked={isHoliday}
                        onChange={toggleHoliday}
                    />
                    <label htmlFor="holidayCheck" style={{ margin: 0, color: '#856404' }}>
                        This day is a Holiday
                    </label>
                </div>

                {message && (
                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}

                <div>
                    {slots.length === 0 ? (
                        <p className="text-center">No classes scheduled for this day.</p>
                    ) : (
                        slots.map((slot, index) => (
                            <div key={index} className="slot-item">
                                <div>
                                    <h4>{slot.subject}</h4>
                                    <p>{slot.time}</p>
                                </div>
                                <div className="attendance-buttons">
                                    <button
                                        className={`btn-present ${attendance[index] === 'Present' ? 'active' : ''}`}
                                        onClick={() => markAttendance(index, 'Present')}
                                        disabled={isHoliday}
                                    >
                                        Present
                                    </button>
                                    <button
                                        className={`btn-absent ${attendance[index] === 'Absent' ? 'active' : ''}`}
                                        onClick={() => markAttendance(index, 'Absent')}
                                        disabled={isHoliday}
                                    >
                                        Absent
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="btn-primary mt-3"
                    onClick={saveAttendance}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default AttendanceMarker;
