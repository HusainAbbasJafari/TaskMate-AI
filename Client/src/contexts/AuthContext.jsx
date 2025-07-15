import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { getLoggedInUser, logoutUser } from '../redux/features/userSlice';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const currentTime = Date.now() / 1000; // Get current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired
          console.log('Token expired');
          logout(); // Logout the user
        } else {
          setIsAuthenticated(true);
          console.log(token,"token useeffeect at authcontext")
         
          dispatch(getLoggedInUser(token)); // getting loggin user detail
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout(); // Logout if the token is invalid
      }
    } else {
      setIsAuthenticated(false);
      dispatch(logoutUser()); // Clear the logged-in user
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    console.log(token,"token at login function")
    dispatch(getLoggedInUser(token)); // Fetch the logged-in user
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    dispatch(logoutUser()); // Clear the logged-in user
    setIsAuthenticated(false);
  };

  const authValue = useMemo(() => ({
    isAuthenticated,
    loading,
    login,
    logout,
  }), [isAuthenticated, loading, login, logout]);
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };