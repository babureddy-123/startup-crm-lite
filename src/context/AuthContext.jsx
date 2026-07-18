import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * @typedef {Object} User
 * @property {string} id - MongoDB ObjectId.
 * @property {string} name - User display name.
 * @property {string} email - Account email.
 * @property {string} role - Access role.
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - The currently authenticated user object.
 * @property {string|null} token - Active JWT token.
 * @property {boolean} isLoading - Loading session resolution status indicator.
 * @property {Function} login - Authenticates credentials.
 * @property {Function} register - Registers new account.
 * @property {Function} logout - Destroys credentials.
 * @property {Function} updateProfile - Updates profile info.
 */

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application and houses state logic for authentication.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Child element nodes.
 * @returns {React.JSX.Element} Context provider wrapper.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile details on mount if crm-token is found
  useEffect(() => {
    async function restoreSession() {
      if (token) {
        if (!user) {
          try {
            const profileData = await authService.getProfile();
            // Profile returns { success: true, message, data: user }
            if (profileData && profileData.data) {
              setUser(profileData.data);
            }
          } catch (error) {
            console.error('Failed to restore user auth session:', error);
            authService.logout();
            setUser(null);
            setToken(null);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
    restoreSession();
  }, [token]);

  /**
   * Performs user login calls.
   *
   * @param {string} email - Username email.
   * @param {string} password - Credentials password.
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      // login response returns { success: true, data: { token, user } }
      if (res && res.data) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData);
        return res.data;
      }
      throw new Error('Malformed server login response');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Performs new account registration calls.
   *
   * @param {string} name - Name display.
   * @param {string} email - Contact email.
   * @param {string} password - Security password.
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      // register response returns { success: true, data: { token, user } }
      if (res && res.data) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData);
        return res.data;
      }
      throw new Error('Malformed server registration response');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the user and clears authentication session data.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  /**
   * Handles user profile updates.
   *
   * @param {Object} data - Profile fields updates data.
   */
  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res && res.data) {
      setUser(res.data);
    }
    return res;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        register, 
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom React hook facilitating quick fetch access to AuthContext parameters.
 *
 * @returns {AuthContextType} Active authentication context values.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be executed within an AuthProvider scope.');
  }
  return context;
}
