import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    // This effect runs when the token changes
    useEffect(() => {
        if (token) {
            // Decode the token to get user info
            const decodedUser = jwtDecode(token);
            setUser(decodedUser.user);
            // Set the token in local storage for persistence
            localStorage.setItem('token', token);
        } else {
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/users/login', { email, password });
        setToken(res.data.token);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;