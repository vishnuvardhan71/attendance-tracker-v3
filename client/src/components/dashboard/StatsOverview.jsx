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

    return (
        <div className="card mb-3">
            <div className="card-body" style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-around',
                flexWrap: 'wrap'
            }}>
                <div className="progress-card" style={{ flex: 1, minWidth: '150px' }}>
                    <h2>{totalClasses}</h2>
                    <p>Total Classes</p>
                </div>
                <div className="progress-card" style={{ flex: 1, minWidth: '150px' }}>
                    <h2>{attendedClasses}</h2>
                    <p>Classes Attended</p>
                </div>
                <div className="progress-card" style={{ flex: 1, minWidth: '150px' }}>
                    <h2>{overallPercent}%</h2>
                    <p>Overall Attendance</p>
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
