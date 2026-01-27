import api from './api';

export const courseService = {
    createCourse: async (name, year, semester) => {
        const response = await api.post('/courses', { name, year, semester });
        return response.data;
    },

    getCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    }
};
