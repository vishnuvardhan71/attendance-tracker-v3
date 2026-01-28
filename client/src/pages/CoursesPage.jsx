import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', year: '', semester: '' });
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadCourses();
        localStorage.removeItem('selectedCourse');
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.year || !formData.semester) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await courseService.createCourse(formData.name, formData.year, formData.semester);
            setFormData({ name: '', year: '', semester: '' });
            setShowModal(false);
            loadCourses();
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to create course');
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(id);
                loadCourses();
            } catch (error) {
                console.error('Failed to delete course:', error);
            }
        }
    };

    const handleCourseClick = (course) => {
        localStorage.setItem('selectedCourse', course._id);
        localStorage.setItem('selectedCourseIndex', course.index);

        if (course.isSetupComplete) {
            navigate(`/dashboard/${course.index}`);
        } else {
            navigate('/attendance-input', { state: { courseId: course._id, index: course.index } });
        }
    };

    return (
        <div className="home-page dashboard-page">
            <Header />

            <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '40px', paddingTop: '40px' }}>
                <div className="card" style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div className="card-header" style={{
                        padding: '30px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ margin: '0 0 15px 0', fontSize: '1.8rem', letterSpacing: '1px', color: '#fff' }}>YOUR COURSES</h2>
                        {courses.length < 2 && (
                            <button
                                className="btn-primary"
                                style={{
                                    width: 'auto',
                                    padding: '10px 24px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    borderRadius: '12px'
                                }}
                                onClick={() => setShowModal(true)}
                            >
                                + Add Course
                            </button>
                        )}
                    </div>
                    <div className="card-body" style={{ padding: '30px' }}>
                        {loading ? (
                            <div className="text-center" style={{ padding: '60px 20px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    width: '50px',
                                    height: '50px',
                                    border: '4px solid rgba(255,255,255,0.1)',
                                    borderTop: '4px solid #667eea',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <p style={{ marginTop: '20px', color: '#94a3b8' }}>Loading courses...</p>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center" style={{ padding: '60px 20px' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#667eea' }}>[Books]</div>
                                <h3 style={{ color: '#fff', marginBottom: '10px' }}>No Courses Yet</h3>
                                <p style={{ color: '#94a3b8', marginBottom: '20px', maxWidth: '400px', margin: '0 auto' }}>
                                    Start your attendance tracking journey by adding your first course.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '20px' }}>
                                {courses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="course-card"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '24px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
                                            e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        }}
                                        onClick={() => handleCourseClick(course)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: '600' }}>
                                                        {course.name}
                                                    </h3>
                                                </div>

                                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                                        Semester {course.semester}
                                                    </span>
                                                    <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                                        Year {course.year}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                className="btn-danger"
                                                style={{
                                                    width: 'auto',
                                                    padding: '10px 20px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCourse(course._id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card" style={{
                        maxWidth: '500px',
                        width: '90%',
                        margin: '20px',
                        animation: 'slideUp 0.3s ease'
                    }}>
                        <div className="card-header">
                            <h2>Add New Course</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddCourse}>
                                {error && (
                                    <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                                        {error}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Computer Science"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Year</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Semester</label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Semester</option>
                                        {[1, 2].map(sem => (
                                            <option key={sem} value={sem}>{sem}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                        Create Course
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            setShowModal(false);
                                            setError('');
                                            setFormData({ name: '', year: '', semester: '' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
