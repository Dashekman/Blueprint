import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSummary, setUserSummary] = useState(null);

  // Initialize user session on app load
  useEffect(() => {
    initializeUserSession();
  }, []);

  const initializeUserSession = async () => {
    try {
      // Check if user session exists in localStorage
      let session = localStorage.getItem('userSession');
      
      if (!session) {
        // Create new user session
        const response = await ApiService.createUserSession();
        if (response.success) {
          session = response.session_id;
          localStorage.setItem('userSession', session);
        } else {
          // Fallback to generating local session
          session = generateLocalSession();
          localStorage.setItem('userSession', session);
        }
      }
      
      setUserSession(session);
      
      // Load user summary
      await loadUserSummary(session);
      
    } catch (error) {
      console.error('Failed to initialize user session:', error);
      // Fallback to local session
      const session = generateLocalSession();
      setUserSession(session);
      localStorage.setItem('userSession', session);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalSession = () => {
    return 'local_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const loadUserSummary = async (session) => {
    try {
      const response = await ApiService.getUserSummary(session);
      if (response.success) {
        setUserSummary(response.summary);
      }
    } catch (error) {
      console.error('Failed to load user summary:', error);
    }
  };

  const refreshUserSummary = async () => {
    if (userSession) {
      await loadUserSummary(userSession);
    }
  };

  const clearUserData = async () => {
    try {
      if (userSession) {
        await ApiService.deleteUserData(userSession);
      }
      
      // Clear local storage
      localStorage.removeItem('userSession');
      localStorage.removeItem('completedTests');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('test_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset state
      setUserSummary(null);
      
      // Create new session
      await initializeUserSession();
      
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  };

  const value = {
    userSession,
    userSummary,
    isLoading,
    refreshUserSummary,
    clearUserData,
    // Computed values
    testsCompleted: userSummary?.tests_completed || 0,
    hasProfile: userSummary?.profile_generated || false,
    completedTestTypes: userSummary?.completed_test_types || [],
    profileConfidence: userSummary?.profile_confidence || 0,
    isReadyForSynthesis: userSummary?.ready_for_synthesis || false
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;