import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function LoginComponent() {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 로그인 버튼 클릭 시 실행될 함수
    const handleLogin = () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        // 로그인 성공 처리 (실제 구현 시 백엔드 API 요청 필요)
        console.log("로그인 정보:", { email, password });

        alert("로그인 성공!"); // 예제용
        navigate("/"); // ✅ 로그인 성공 시 메인 페이지로 이동 (http://localhost:3000/)
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                    로그인
                </button>

                <p className="text-center mt-4 text-gray-500">
                    계정이 없으신가요?
                    <button onClick={() => navigate("/signup")} className="text-blue-500 ml-1 hover:underline">
                        회원가입
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginComponent;
