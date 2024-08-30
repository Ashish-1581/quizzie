import axios from 'axios';
const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const create_Poll = async (poll,quizId,token) => {
    try {
       
        const response = await axios.post(`${baseUrl}/poll/createPoll/${quizId}`, poll,{
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
   
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const get_Polls = async (userId) => {
    try {
       
        const response = await axios.get(`${baseUrl}/poll/getPolls`,{params: { userId }});
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}


export const get_PollById = async (quizId) => {
    try {
        const response = await axios.get(`${baseUrl}/poll/getPoll/${quizId}`);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}

export const update_Poll = async (poll,quizId) => {
    try {
        const response = await axios.patch(`${baseUrl}/poll/updatePoll/${quizId}`, poll);
        return response;
    } catch (error) {
        return { error: error.response.data.message };
    }
}
