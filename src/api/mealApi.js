import axios from 'axios';
import jwtAxios from "../util/jwtUtil"
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/meals`

export const recordMeal = async (mealData) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        console.log("mealData: ", mealData, "header: ", header);
        const res = await jwtAxios.post(`${prefix}`, mealData, header);
        return res.data;
    } catch (error) {
        console.error("Failed to record meal:", error);
        throw error;
    }
};

export const fetchMeals = async () => {
    try {
        const res = await jwtAxios.get(`${prefix}`);
        return res.data;
    } catch (error) {
        console.error("Failed to fetch meals:", error);
        throw error;
    }
};

