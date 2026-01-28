import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const GuidePage = () => {
    return (
        <div className="home-page guide-page">
            <Header />

            <main className="hero-section" style={{ paddingTop: '40px' }}>
                <div className="card" style={{
                    maxWidth: '900px',
                    width: '100%',
                    margin: '0 auto',
                    textAlign: 'left',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                    <div className="card-header">
                        <h1>How to Use AttendIt</h1>
                    </div>
                    <div className="card-body" style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem' }}>
                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white', fontSize: '1.5rem' }}>1. Creating Your Account</h2>
                            <p>To start tracking your attendance, create a new account.If you already have an account, simply log in using your existing credentials.</p>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white', fontSize: '1.5rem' }}>2. Managing Your Courses</h2>
                            <p>Once logged in, you will be taken to the My Courses page. This is your central hub for course management:</p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li><strong>Add Course:</strong> Click the Add Course button to register a new course. Select your academic Year (1–4) and Semester (1–2).</li>
                                <li><strong>Limit:</strong> You can manage up to 3 courses at a time.</li>
                                <li><strong>Accessing Dashboard:</strong> Click on any course card to open its specific attendance tracker and dashboard.</li>
                            </ul>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white', fontSize: '1.5rem' }}>3. Personalized Setup</h2>
                            <p>Once a course is selected, configure its timetable based on your college schedule:</p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li><strong>Timings:</strong> Set your college start/end times and period durations.</li>
                                <li><strong>Subjects & Timetable:</strong> Add subjects and assign them to the appropriate time slots in your weekly timetable.</li>
                            </ul>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white', fontSize: '1.5rem' }}>4. Daily Attendance Tracking</h2>
                            <p>Use the dashboard to mark your classes daily:</p>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li><strong>Marking:</strong> Select a date and mark each class as Present or Absent.</li>
                                <li><strong>Holidays:</strong> Mark an entire day as a holiday if classes were not held.</li>
                                <li><strong>Eligibility:</strong> The system automatically calculates if you are above the 75 percent requirement and shows exactly how many classes you can afford to miss.</li>
                            </ul>
                        </section>

                        <div className="text-center mt-3" style={{
                            padding: '20px',
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '8px',
                            borderLeft: '4px solid #667eea'
                        }}>
                            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', margin: 0 }}>
                                "Mark daily, stay eligible, succeed with AttendIt."
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default GuidePage;
