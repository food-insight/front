import React, { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import { register } from "../../api/memberApi";
import { useDispatch } from 'react-redux';

const LoginModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true); // true면 로그인, false면 회원가입
    const [loginParam, setLoginParam] = useState({ email: '', password: '', keepLoggedIn: false });
    const [signupParam, setSignupParam] = useState({ email: '', password: '', role: 'USER', name: '', gender: '', birth: '', allergies: '', health_goal: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const { doLogin } = useCustomLogin();

    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    const passwordRegEx = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~-]{8,20}$/;



    // 입력 핸들러
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        if (isLogin) {
            setLoginParam(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value, // 체크박스일 경우 checked 값을 사용
            }));
        } else {
            setSignupParam(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    // 엔터 키 감지 핸들러
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isLogin) {
                handleClickLogin();
            } else {
                handleClickSignup();
            }
        }
    };

    // 로그인 유효성 검사
    const validateLogin = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!emailRegEx.test(loginParam.email)) {
            newErrors.email = '유효한 이메일 주소를 입력하세요.';
            isValid = false;
        }

        if (!passwordRegEx.test(loginParam.password)) {
            newErrors.password = '비밀번호가 유효하지 않습니다.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 회원가입 유효성 검사
    const validateSignup = () => {
        let isValid = true;
        const newErrors = { email: '', password: '', name: '', gender: '', birth: '', allergies: '', health_goal: '' };

        if (!emailRegEx.test(signupParam.email)) {
            newErrors.email = '유효한 이메일 주소를 입력하세요.';
            isValid = false;
        }

        if (!passwordRegEx.test(signupParam.password)) {
            newErrors.password = '비밀번호가 유효하지 않습니다.';
            isValid = false;
        }

        if (!signupParam.name) {
            newErrors.name = '이름을 입력하세요.';
            isValid = false;
        }

        if (!signupParam.gender) {
            newErrors.gender = '성별을 선택하세요.';
            isValid = false;
        }

        if (!signupParam.birth) {
            newErrors.birth = '생년월일을 입력하세요.';
            isValid = false;
        }

        if (!signupParam.allergies) {
            newErrors.allergies = '알레르기를 입력하세요.';
            isValid = false;
        }

        if (!signupParam.health_goal) {
            newErrors.health_goal = '건강 목표를 입력하세요.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 입력 필드 초기화 함수
    const refreshFields = () => {
        setLoginParam({ email: '', password: '', keepLoggedIn: false }); // 로그인 폼 초기화
        setSignupParam({ email: '', password: '', nickname: '', role: 'USER', name: '', gender: '', birth: '', allergies: '', health_goal: '' }); // 회원가입 폼 초기화
        setErrors({ email: '', password: '', nickname: '', name: '', gender: '', birth: '', allergies: '', health_goal: '' }); // 에러 메시지 초기화
    };

    // 로그인 버튼 클릭 핸들러
    const handleClickLogin = () => {
        if (!validateLogin()) {
            return;
        }

        doLogin(loginParam).then(data => {
            if (data.error) {
                setErrors({
                    email: '',
                    password: '이메일 또는 비밀번호가 유효하지 않습니다.'
                });
            } else {
                localStorage.setItem("user", JSON.stringify(data));
                alert("다시 오셨군요! 환영합니다.");
                // 로그인 후 입력란 초기화
                refreshFields();
                onClose();
            }
        });
    };

    const handleClickSignup = async () => {
        if (!validateSignup()) {
            return;
        }

        try {
            await register(signupParam);
            alert('회원가입이 완료되었습니다. 로그인해주세요.');

            // 회원가입 후 입력란 초기화
            refreshFields();
            setIsLogin(true); // 회원가입 후 로그인 화면으로 돌아가기

            // 로컬 스토리지에 회원 정보 저장
            localStorage.setItem('user', JSON.stringify(signupParam));

        } catch (error) {
            setErrors({
                email: error.response?.data?.error === "EMAIL_ALREADY_EXISTS" ? "이미 등록된 이메일입니다." : '',
                password: '',
                nickname: '',
                name: '',
                gender: '',
                birth: '',
                allergies: '',
                health_goal: ''
            });
        }
    };


    const confirmClose = () => {
        if (window.confirm("진행상황이 저장되지 않습니다. 정말로 닫으시겠습니까?")) {
            // 상태 초기화
            setIsLogin(true); // 로그인 상태로 돌아가기
            refreshFields(); // 입력란 초기화
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
        >
            <div
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-4 right-4" onClick={confirmClose}>
                    <span className="text-3xl font-bold text-gray-400 hover:text-gray-600">&times;</span>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-black">{isLogin ? "로그인" : "회원가입"}</h2>
                </div>

                {/* 로그인 또는 회원가입 폼 */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={isLogin ? loginParam.email : signupParam.email}
                        placeholder="이메일을 입력하세요."
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={isLogin ? loginParam.password : signupParam.password}
                        placeholder="비밀번호를 입력하세요."
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={signupParam.name}
                                placeholder="이름을 입력하세요."
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="gender">
                                Gender
                            </label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    name="gender"
                                    value="male"
                                    onClick={() => handleChange({target: {name: 'gender', value: 'male'}})}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors duration-200 ${signupParam.gender === 'male' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                                >
                                    남성
                                </button>
                                <button
                                    type="button"
                                    name="gender"
                                    value="female"
                                    onClick={() => handleChange({target: {name: 'gender', value: 'female'}})}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors duration-200 ${signupParam.gender === 'female' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
                                >
                                    여성
                                </button>
                            </div>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="birth">
                                Birth
                            </label>
                            <input
                                id="birth"
                                name="birth"
                                type="date"
                                value={signupParam.birth}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`w-full p-2 border ${errors.birth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                            />
                            {errors.birth && <p className="text-red-500 text-sm mt-1">{errors.birth}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="allergies">
                                Allergies
                            </label>
                            <input
                                id="allergies"
                                name="allergies"
                                type="text"
                                value={signupParam.allergies}
                                placeholder="알레르기를 입력하세요. (쉼표로 구분)"
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'allergies',
                                        value: e.target.value.split(',').map(item => item.trim())
                                    }
                                })}
                                onKeyDown={handleKeyDown}
                                className={`w-full p-2 border ${errors.allergies ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                            />
                            {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2" htmlFor="health_goal">
                                Health Goal
                            </label>
                            <input
                                id="health_goal"
                                name="health_goal"
                                type="text"
                                value={signupParam.health_goal}
                                placeholder="건강 목표를 입력하세요."
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={`w-full p-2 border ${errors.health_goal ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black`}
                            />
                            {errors.health_goal && <p className="text-red-500 text-sm mt-1">{errors.health_goal}</p>}
                        </div>
                    </>
                )}

                <div className="mb-2">
                    <button
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                        onClick={isLogin ? handleClickLogin : handleClickSignup}
                    >
                        {isLogin ? "로그인" : "회원가입"}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        {isLogin
                            ? "아직 계정이 없으신가요? "
                            : "계정이 있으신가요? "}
                        <span
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
                            {isLogin ? "회원가입" : "로그인"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;