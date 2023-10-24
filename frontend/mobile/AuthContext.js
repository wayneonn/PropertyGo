import React, {createContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import configData from "./config.json"
import io from 'socket.io-client';

const BASE_URL = configData.BASE_URL;
const socket = io(BASE_URL);

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
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

    const updateUserProfilePicture = async (newProfileImageBase64) => {
        try {
            // Update the user state with the new profile image
            setUser((prevUser) => ({
                ...prevUser,
                user: {
                    ...prevUser.user,
                    profileImage: {
                        data: newProfileImageBase64,
                    },
                },
            }));

            // Also update the user session stored in AsyncStorage
            const userJson = await AsyncStorage.getItem('userSession');
            if (userJson) {
                const userData = JSON.parse(userJson);
                userData.user.profileImage = {data: newProfileImageBase64};
                await AsyncStorage.setItem('userSession', JSON.stringify(userData));
            }

            // Reload the updated user data from AsyncStorage
            loadUserSessionFromStorage();

        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
    };

    // Define your login and logout functions as before

    const login = async (userData) => {
        try {
            // Save the user session to AsyncStorage
            await AsyncStorage.setItem('userSession', JSON.stringify(userData));
            setUser(userData);
            socket.emit('login', userData.user.userId);
            console.log('User session saved');
            // console.log("userId:" , userData.user.userId);
        } catch (error) {
            console.error('Error saving user session:', error);
        }
    };

    const logout = async () => {
        try {
            // Remove the user session from AsyncStorage
            await AsyncStorage.removeItem('userSession');
            socket.emit('logout', user.user.userId);
            setUser(null);
            console.log('User session removed');
        } catch (error) {
            console.error('Error removing user session:', error);
        }
    };

    // Pass the user and loading state in the context value
    const contextValue = useMemo(() => {
        return {user, loading, login, logout, updateUserProfilePicture};
    }, [user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
