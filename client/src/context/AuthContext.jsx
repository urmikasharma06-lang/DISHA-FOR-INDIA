import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the Bearer token in Axios default headers
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('accessToken', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('accessToken');
    }
  };

  // Check user session status on application mount
  const checkAuth = async () => {
    try {
      // 1. Try using local storage token if present
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        setAuthHeader(savedToken);
      }

      // 2. Fetch current profile from backend (/auth/me)
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        // Fallback check if auth/me fails or returns empty
        setUser(null);
      }
    } catch (err) {
      // Clean up token if it's invalid/expired
      setAuthHeader(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { user: loggedInUser, accessToken } = res.data;
        setUser(loggedInUser);
        if (accessToken) {
          setAuthHeader(accessToken);
        }
        return { success: true, user: loggedInUser };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const errMsg = err.message || 'Invalid email or password';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success && res.data) {
        const { user: registeredUser } = res.data;
        // Optionally auto-login if the server returns token, or require redirecting to login page
        return { success: true, user: registeredUser };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const errMsg = err.message || 'Could not complete registration';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      setUser(null);
      setAuthHeader(null);
      setLoading(false);
    }
  };

  // Refresh user profile details (useful after joining programs, completing tasks, earning rewards)
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user details:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        checkAuth,
      }}
    >
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
