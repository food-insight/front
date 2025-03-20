import axios from "axios";
import { getCookie } from "./cookieUtil";

const jwtAxios = axios.create();

// before request
const beforeReq = (config) => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    if (!accessToken || !refreshToken) {
        console.error("Tokens NOT FOUND");
        return Promise.reject({
            response: {
                data: {
                    error: "REQUIRE_LOGIN"
                }
            }
        });
    }

    // Authorization header 처리
    config.headers.Authorization = `${accessToken}`;
    return config;
};

// fail request
const requestFail = (err) => {
    console.error("request error............");
    return Promise.reject(err);
};

// before return response
const beforeRes = async (res) => {
    const data = res.data;

    if (data && data.error === 'ERROR_ACCESS_TOKEN') {
        // Handle token error, possibly refresh token logic here
    }

    return res;
};

// fail response
const responseFail = (err) => {
    console.error("response fail error.............");
    return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;