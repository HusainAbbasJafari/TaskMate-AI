
import axiosInstance from './axiosInstance';

export const signup = async (userData) => {
  const response = await axiosInstance.post('/users/signup', userData);
  return response.data;
};

export const login = async (userData) => {
    const response = await axiosInstance.post('/users/login', userData);
    return response.data;
};

export const getUsers = async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
};

export const getSingleUser = async (userId) => {
  if (!userId) throw new Error('User id is required');

  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};
