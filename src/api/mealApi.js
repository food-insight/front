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

export const deleteMeal = async (mealId) => {
    try {
        const res = await jwtAxios.delete(`${prefix}/${mealId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to delete meal:", error);
        throw error;
    }
};

export const updateMeal = async (mealId, mealData) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        const res = await jwtAxios.put(`${prefix}/${mealId}`, mealData, header);
        return res.data;
    } catch (error) {
        console.error("Failed to update meal:", error);
        throw error;
    }
};