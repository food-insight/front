import { useDispatch, useSelector } from "react-redux";
import { Navigate, createSearchParams, useNavigate } from "react-router-dom";
import { loginPostAsync, login, logout } from "../slices/loginSlice";
import { removeCookie, setCookie } from "../util/cookieUtil";
import { logoutMember } from "../api/memberApi";

const useCustomLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginState = useSelector(state => state.loginSlice);
    const isLogin = loginState.email ? true : false;

    const doLogin = async (loginParam) => {
        const action = await dispatch(loginPostAsync(loginParam));
        const response = action.payload;

        if (!response) {
            return { error: true, message: "로그인 요청에 실패했습니다." };
        }

        const { accessToken, refreshToken } = response;

        if (accessToken && refreshToken) {
            setCookie("accessToken", accessToken);
            setCookie("refreshToken", refreshToken);
        }

        if (response[1] === 200 && response[0].success) {
            dispatch(login(response[0].data.user));
            return response[0].data.user;
        } else if (response[1] === 401) {
            return { error: true, message: "이메일 또는 비밀번호가 잘못되었습니다." };
        } else {
            return { error: true };
        }
    };

    const doLogout = async () => {
        try {
            await logoutMember();
            dispatch(logout());
            removeCookie("member");
            removeCookie("accessToken");
            removeCookie("refreshToken");
            // 로컬 스토리지에서 'user' 키 제거
            localStorage.removeItem("user");
            console.log(localStorage.getItem("user")); // null이면 삭제된 것

            alert("로그아웃되었습니다.");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("로그아웃에 실패했습니다.");
        }
    };

    const moveToPath = (path) => {
        navigate({ pathname: path }, { replace: true });
    };

    const moveToLogin = () => {
        navigate({ pathname: '/member/login' }, { replace: true });
    };

    const moveToLoginReturn = () => {
        return <Navigate replace to="/member/login" />;
    };

    const exceptionHandle = (ex) => {
        const errorMsg = ex.response.data.error;
        const errorStr = createSearchParams({ error: errorMsg }).toString();
        if (errorMsg === 'REQUIRE_LOGIN') {
            alert("로그인 해야만 합니다.");
            navigate({ pathname: '/member/login', search: errorStr });
            return;
        }
        if (ex.response.data.error === 'ERROR_ACCESS_DENIED') {
            alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
            navigate({ pathname: '/member/login', search: errorStr });
            return;
        }
    };

    return {
        loginState, isLogin, doLogin, doLogout, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle
    };
};

export default useCustomLogin;