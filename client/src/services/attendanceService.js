import api from './api';

export const attendanceService = {
    markAttendance: async (date, slots, isHoliday, courseId) => {
        // Convert frontend format to backend format
        const records = slots.map(slot => ({
            periodTime: slot.time || '',
            subject: slot.subject || '',
            status: slot.status || 'Absent'
        }));

        const response = await api.post('/attendance', {
            date,
            isHoliday,
            records,
            courseId
        });
        return response.data;
    },

    getAttendance: async (date, courseId) => {
        const response = await api.get(`/attendance/date/${date}?courseId=${courseId}`);
        return response.data;
    },

    getStats: async (courseId) => {
        const response = await api.get(`/attendance/stats?courseId=${courseId}`);
        const data = response.data;

        // Transform subjectStats object to array format expected by frontend
        const subjectStatsArray = Object.keys(data.subjectStats || {}).map(name => ({
            name,
            total: data.subjectStats[name].total,
            attended: data.subjectStats[name].attended
        }));

        return {
            totalClasses: data.totalClasses || 0,
            attendedClasses: data.attendedClasses || 0,
            overallPercentage: data.overallPercentage || 0,
            subjectStats: subjectStatsArray
        };
    },

    saveInitialStats: async (total, attended, courseId) => {
        const response = await api.put('/auth/initial-stats', { total, attended, courseId });
        return response.data;
    }
};
