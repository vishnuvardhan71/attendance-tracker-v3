import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DotGrid from '../components/common/DotGrid';

const GuidePage = () => {
    return (
        <div className="home-page guide-page">
            <Header />
            <main className="hero-section" style={{ paddingTop: '40px' }}>
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                    <div className="card-header">
                        <h1>How to Use Attendly 📚</h1>
                    </div>
                    <div className="card-body" style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white' }}>1. Getting Started 🚀</h2>
                            <p>Attendly is your personal college attendance tracker. Start by signing up for a new account or logging in if you already have one.</p>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white' }}>2. Initial Setup ⚙️</h2>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li><strong>Attendance Stats:</strong> Optionally enter your current attendance percentage.</li>
                                <li><strong>Subjects:</strong> List all your current semester subjects.</li>
                                <li><strong>Timetable:</strong> Drag and drop or select subjects for each time slot in your week.</li>
                            </ul>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white' }}>3. Daily Tracking 📅</h2>
                            <p>Mark each class as <strong>Present</strong> or <strong>Absent</strong>. The dashboard will instantly show your eligibility status and how many classes you can afford to miss.</p>
                        </section>

                        <section className="mb-3">
                            <h2 className="mb-2" style={{ color: 'white' }}>4. Dashboards 📈</h2>
                            <p>Choose between a <strong>Simple Dashboard</strong> for quick daily entry or the <strong>Full Dashboard</strong> for deep analytics.</p>
                        </section>

                        <div className="text-center mt-3">
                            <p><em>"Mark daily, stay eligible, succeed with Attendly."</em></p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GuidePage;
