import axios from 'axios';
const baseUrl = 'http://localhost:3000';

export const login = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/login`, user);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const signup = async (user) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/signup`, user);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}