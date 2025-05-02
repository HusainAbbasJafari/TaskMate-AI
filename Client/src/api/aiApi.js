import axiosInstance from './axiosInstance';

export const fetchAISuggestions = async (value) => {
    try {
        const res = await axiosInstance.post('/ai/suggestions', { input: value });
        return res.data.suggestions;
    } catch (err) {
        console.error('AI suggestion error:', err);
        return [];
    }
  
};

export const fetchAIChatBot = async (value, chatHistory = []) => {
    try {
        const res = await axiosInstance.post('/ai/chatbot', {
            input: value,
            chatHistory
        });
        return res.data;
    } catch (err) {
        console.error('AI chatbot error:', err);
        return { text: 'Sorry, something went wrong.' };
    }
};



