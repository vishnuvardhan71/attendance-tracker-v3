import api from './api';

export const timetableService = {
    getConfig: async () => {
        const response = await api.get('/timetable/config');
        return response.data;
    },

    saveConfig: async (configData) => {
        const response = await api.post('/timetable/config', configData);
        return response.data;
    },

    getTimetable: async (date) => {
        const response = await api.get(`/timetable/day?date=${date}`);
        return response.data;
    }
};
