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

                        return (
                            <div key={index} className={`subject-stat ${percentage < 75 ? 'danger' : ''}`}>
                                <h4>{subject.name}</h4>
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${percentage < 75 ? 'bg-danger' : 'bg-success'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <p className={`stat-text ${percentage < 75 ? 'text-danger' : 'text-success'}`}>
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
