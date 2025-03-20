import axios from 'axios';
import jwtAxios from "../util/jwtUtil";
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/images`;

export const uploadImage = async (filename, mealId) => {
    const formData = new FormData();
    formData.append('image', filename);
    formData.append('meal_id', mealId);

    console.log("formData: ", formData);
    try {
        const res = await jwtAxios.post(`${prefix}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (error) {
        console.error("Failed to upload image:", error);
        throw error;
    }
};

export const fetchImage = async (imagePath) => {
    try {
        const res = await axios.get(`${prefix}/view/${imagePath}`, { responseType: 'blob' });
        return URL.createObjectURL(res.data);
    } catch (error) {
        console.error("Failed to fetch image:", error);
        throw error;
    }
};