import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseAuth from '../services/firebaseAuth';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app load
    const checkAuthState = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          // Verify token is still valid by checking with backend
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth state check failed:', error);
        // Clear invalid session
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();

    // Also listen to Firebase auth state changes for Firebase-based authentication
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && !user) {
        // Only set Firebase user if no backend user is already set
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        
        // Store user data in localStorage for compatibility
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Get and store the ID token
        firebaseUser.getIdToken().then(token => {
          localStorage.setItem('token', token);
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const login = async (credentials) => {
    try {
      // Use authService for userId-based login (backend API)
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await firebaseAuth.register(
        userData.email, 
        userData.password, 
        userData.displayName || userData.name
      );
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await firebaseAuth.logout(); // Also logout from Firebase if signed in
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const resetPassword = async (email) => {
    try {
      await firebaseAuth.resetPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 