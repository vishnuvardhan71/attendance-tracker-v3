import api from './api';

export const timetableService = {
    getConfig: async (courseId) => {
        const response = await api.get(`/timetable/config?courseId=${courseId}`);
        return response.data;
    },

    saveConfig: async (configData) => {
        const response = await api.post('/timetable/config', configData);
        return response.data;
    },

    getTimetable: async (date, courseId) => {
        const response = await api.get(`/timetable/day?date=${date}&courseId=${courseId}`);
        return response.data;
    }
};
