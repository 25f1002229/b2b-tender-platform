import api from './api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const register = async (email: string, password: string, companyName: string) => {
  try {
    const response = await api.post('auth/register', { email, password, companyName });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || "Registration failed";
  }
};
