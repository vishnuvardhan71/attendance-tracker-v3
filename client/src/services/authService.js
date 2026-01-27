import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
        }
        return response.data;
    },

    signup: async (username, password, email, fullName) => {
        const response = await api.post('/auth/signup', { username, password, email, fullName });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUser: () => {
        return localStorage.getItem('username');
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};
