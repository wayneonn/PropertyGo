import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

  // Define your login and logout functions as before

  const login = async (userData) => {
    try {
      // Save the user session to AsyncStorage
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      setUser(userData);
      console.log('User session saved');
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  };

  const logout = async () => {
    try {
      // Remove the user session from AsyncStorage
      await AsyncStorage.removeItem('userSession');
      setUser(null);
      console.log('User session removed');
    } catch (error) {
      console.error('Error removing user session:', error);
    }
  };

  // Pass the user and loading state in the context value
  const contextValue = useMemo(() => {
    return { user, loading, login, logout };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
