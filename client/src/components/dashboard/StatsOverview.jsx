import React from 'react';

const StatsOverview = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="card mb-3">
                <div className="card-body text-center">
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    const totalClasses = stats?.totalClasses || 0;
    const attendedClasses = stats?.attendedClasses || 0;
    const overallPercent = totalClasses > 0
        ? ((attendedClasses / totalClasses) * 100).toFixed(1)
        : 0;

    const neededClasses = Math.max(0, Math.ceil(3 * totalClasses - 4 * attendedClasses));

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="stats-grid mb-3">
                    <div className="progress-card">
                        <h2>{totalClasses}</h2>
                        <p>Total Classes</p>
                    </div>
                    <div className="progress-card">
                        <h2>{attendedClasses}</h2>
                        <p>Classes Attended</p>
                    </div>
                    <div className="progress-card">
                        <h2 className={overallPercent < 75 ? 'text-danger' : 'text-success'}>
                            {overallPercent}%
                        </h2>
                        <p>Overall Attendance</p>
                        <div className="progress-bar" style={{ height: '4px', marginTop: '10px' }}>
                            <div
                                className={`progress-fill ${overallPercent < 75 ? 'bg-danger' : 'bg-success'}`}
                                style={{ width: `${overallPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="target-message text-center">
                    {overallPercent >= 75 ? (
                        <p className="text-success" style={{ fontWeight: '600' }}>
                            🎉 Great job! You are above 75%. Keep it up!
                        </p>
                    ) : (
                        <p className="text-danger" style={{ fontWeight: '600' }}>
                            ⚠️ You need to attend <strong>{neededClasses}</strong> more classes to reach 75%.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
