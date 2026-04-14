import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

const AuthContext = createContext(null);

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
    // Check for stored user session with expiry validation
    const storedUser = localStorage.getItem('mepc_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Check expiry and validity
        if (userData.expiry && Date.now() > userData.expiry) {
          console.log('Session expired, auto-logout');
          localStorage.removeItem('mepc_user');
        } else if (userData.id && userData.email && userData.role === 'admin') {
          setUser(userData);
        } else {
          localStorage.removeItem('mepc_user');
        }
      } catch (e) {
        localStorage.removeItem('mepc_user');
      }
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    try {
      const response = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      let data = null;

      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          if (!response.ok) {
            throw new Error(`Login failed (HTTP ${response.status})`);
          }
          throw new Error('Server returned an invalid response');
        }
      }

      if (!response.ok) {
        throw new Error(data?.error || `Login failed (HTTP ${response.status})`);
      }

      // Store user in state and localStorage with expiry (24h)
      const userWithExpiry = {
        ...data.user,
        expiry: Date.now() + 24 * 60 * 60 * 1000  // 24 hours
      };
      setUser(userWithExpiry);
      localStorage.setItem('mepc_user', JSON.stringify(userWithExpiry));


      return { success: true, message: data?.message || 'Login successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mepc_user');
  };

  const isAuthenticated = () => {
    return user !== null && user.role === 'admin';
  };


  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
