import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState(authService.getUser());
    const [loading, setLoading] = useState(false);

    const extractError = (error, defaultMsg) => {
        const data = error.response?.data;
        if (data?.msg) return data.msg;
        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            return data.errors[0].msg;
        }
        if (data?.message) return data.message;
        return defaultMsg;
    };

    const login = async (username, password) => {
        setLoading(true);
        try {
            await authService.login(username, password);
            setIsAuthenticated(true);
            setUser(username);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: extractError(error, 'Login failed')
            };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (username, password, email, fullName) => {
        setLoading(true);
        try {
            await authService.signup(username, password, email, fullName);
            setIsAuthenticated(true);
            setUser(username);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: extractError(error, 'Signup failed')
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            signup,
            logout,
            loading,
            user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
