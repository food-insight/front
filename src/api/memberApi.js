import axios from 'axios';
import jwtAxios from "../util/jwtUtil"
import API_SERVER_HOST from "./apiConfig";

const prefix = `${API_SERVER_HOST}/auth`

export const loginMember = async (loginParam) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const res = await axios.post(`${prefix}/login`, loginParam, header);

    const { data } = res;
    const accessToken = res.headers['authorization'];
    const refreshToken = res.headers['refresh-token'];


    return { ...data, accessToken, refreshToken };
}

export const register = async (member) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const res = await axios.post(`${prefix}/register`, member, header);

    return res.data;
}

export const logoutMember = async () => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const res = await jwtAxios.post(`${prefix}/logout`, header);
    return res.data;
}