import axios from 'axios';
import jwtAxios from "../util/jwtUtil"
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/speech`

export const recognizeSpeech = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    try {
        const res = await jwtAxios.post(`${prefix}/meal-record`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Failed to recognize speech:", error);
        throw error;
    }
}