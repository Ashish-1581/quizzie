import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const create_Quiz = async (quiz,token) => {
    try {
        const response = await axios.post(`${baseUrl}/quiz/createQuiz`, quiz,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_Quizzes = async (token) => {
    try {
      
        const response = await axios.get(`${baseUrl}/quiz/getQuizzes`,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_QuizById = async (quizId) => {
    try {
        const response = await axios.get(`${baseUrl}/quiz/getQuiz/${quizId}`);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const update_Quiz = async ({ quizId, impression }) => {
    try {
        const response = await axios.patch(`${baseUrl}/quiz/updateQuiz`, { quizId, impression });
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const delete_Quiz = async (quizId) => {
    try {
        const response = await axios.delete(`${baseUrl}/quiz/deleteQuiz/${quizId}`);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

