import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user session from AsyncStorage on app startup
    loadUserSessionFromStorage();
  }, []);

  const loadUserSessionFromStorage = async () => {
    try {
      const userJson = await AsyncStorage.getItem('userSession');
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      // Save the user session to AsyncStorage
      const userJson = JSON.stringify(userData);
      await AsyncStorage.setItem('userSession', userJson);
      console.log('User logged in:', userData); 
      setUser(userData);
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  };

  const logout = async () => {
    try {
      // Remove the user session from AsyncStorage
      await AsyncStorage.removeItem('userSession');
      setUser(null);
    } catch (error) {
      console.error('Error removing user session:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
