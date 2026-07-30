import React, { createContext, useState, useCallback, useEffect } from 'react';
import { getAuthState, saveAuth as persistAuth, logout as persistLogout } from '../store/authStore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setLoggedIn] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);

    //load auth state from storage on app start
    useEffect(() => {
        checkAuthOnStart();
    }, []);

    const checkAuthOnStart = async () => {
        try {
            const auth =  await getAuthState();
            if (auth.token) {
                setLoggedIn(true);
                setUserRole(auth.role);
            } else {
                setLoggedIn(false);
                setUserRole(null);
            }
        } catch (error) {
            console.error('[AuthContext] Start check error:', error)
            setLoggedIn(false);
            setUserRole(null);
        }
    };

    // Login function  - updates context immediately
    const login = useCallback(async (token, userData) => {
        try {
            await persistAuth(token, userData);
            setLoggedIn(true);
            setUserRole(userData.role);
            setUser(userData);
            console.log('[AuthContext] Login successful, role:', userData.role);
        } catch (error) {
            console.error('[AuthContext] Login error:', error );
            throw error
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await persistLogout();

            setLoggedIn(false);
            setUserRole(null);
            setUser(null);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    const value = {
        isLoggedIn,
        userRole,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}