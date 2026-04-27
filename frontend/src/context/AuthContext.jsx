import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUtils, authAPI } from '../services/api.js';
// import socketService from '../services/socket.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    if (apiUtils.isAuthenticated()) {
      const token = localStorage.getItem('healrec_token');
      const userData = localStorage.getItem('healrec_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Connect to socket for real-time features
        // socketService.connect(token);
        // socketService.joinUserRoom(parsedUser._id);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('healrec_token', response.data.token);
        localStorage.setItem('healrec_user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('healrec_token', response.data.token);
        localStorage.setItem('healrec_user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiUtils.logout();
    // socketService.disconnect();
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('healrec_user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
