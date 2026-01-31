import React from 'react';

const SubjectStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="card">
                <div className="card-header">
                    <h3>Subject-wise Attendance</h3>
                </div>
                <div className="card-body">
                    <p className="text-center">Loading stats...</p>
                </div>
            </div>
        );
    }

    const subjectStats = stats?.subjectStats || [];

    return (
        <div className="card">
            <div className="card-header">
                <h3>Subject-wise Attendance</h3>
            </div>
            <div className="card-body">
                {subjectStats.length === 0 ? (
                    <p className="text-center">No attendance data yet.</p>
                ) : (
                    subjectStats.map((subject, index) => {
                        const percentage = subject.total > 0
                            ? ((subject.attended / subject.total) * 100).toFixed(1)
                            : 0;
                        const isDanger = subject.total > 0 && percentage < 75;

                        return (
                            <div key={index} className={`subject-stat ${isDanger ? 'danger' : ''}`}>
                                <h4>{subject.name}</h4>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${isDanger ? 'bg-danger' : 'bg-success'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <p className={`stat-text ${isDanger ? 'text-danger' : 'text-success'}`}>
                                    {subject.attended} / {subject.total} classes ({percentage}%)
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SubjectStats;
