import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const create_Response = async (quizId, response) => {
    try {
        const res = await axios.post(`${baseUrl}/response/${quizId}`, response);
        return res;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_ResponseById = async (quizId) => {
    try {
        const res = await axios.get(`${baseUrl}/response/${quizId}`);
        return res;
    } catch (error) {
        return { error: error.response.data.message };
    }
}



