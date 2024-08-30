import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const create_Qna = async (qna,quizId,token) => {
    try {
       
        const response = await axios.post(`${baseUrl}/qna/createQna/${quizId}`, qna,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
   
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_Qnas = async (userId) => {
    try {
        const response = await axios.get(`${baseUrl}/qna/getQnas`,{params: { userId }});
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_QnaById = async (quizId) => {
    try {
        const response = await axios.get(`${baseUrl}/qna/getQna/${quizId}`);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const update_Qna = async (qna,quizId) => {
    try {
        const response = await axios.patch(`${baseUrl}/qna/updateQna/${quizId}`, qna);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}