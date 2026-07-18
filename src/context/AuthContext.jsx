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
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile details ONLY once on initial mount if token exists
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          const profileData = await authService.getProfile();
          if (isMounted && profileData && profileData.data) {
            setUser(profileData.data);
          }
        } catch (error) {
          console.error('Failed to restore user auth session:', error);
          if (isMounted) {
            authService.logout();
            setUser(null);
            setToken(null);
          }
        }
      } else if (isMounted) {
        setUser(null);
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

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
      if (res && res.data && res.data.token) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData || null);
        setIsLoading(false);
        return res.data;
      }
      throw new Error(res?.message || 'Malformed server login response');
    } catch (error) {
      setIsLoading(false);
      throw error;
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
      if (res && res.data && res.data.token) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('crm-token', userToken);
        setToken(userToken);
        setUser(userData || { name, email, role: 'User' });
        setIsLoading(false);
        return res.data;
      }
      throw new Error(res?.message || 'Malformed server registration response');
    } catch (error) {
      setIsLoading(false);
      throw error;
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
    setIsLoading(false);
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
