import React, { createContext, useContext, useReducer, useState } from 'react';

const ProfileContext = createContext();

const initialState = {
  profileData: null,
  profileImageBase64: null, // Add a new state for profileImageBase64
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, profileData: action.payload };
    case 'UPDATE_PROFILE_IMAGE':
      return { ...state, profileImageBase64: action.payload };
    default:
      return state;
  }
};

const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export { ProfileProvider, useProfile };
