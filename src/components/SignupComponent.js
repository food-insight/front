import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupComponent() {
    const navigate = useNavigate();

    // 상태 변수
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [goal, setGoal] = useState("");
    const [healthConditions, setHealthConditions] = useState([]);
    const [allergies, setAllergies] = useState("");

    // 건강 특성 목록
    const healthOptions = ["당뇨", "고혈압", "채식", "유당불내증", "위염"];

    // 체크박스 핸들러
    const handleCheckboxChange = (option) => {
        setHealthConditions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    // 회원가입 버튼 클릭 시 실행
    const handleSignup = () => {
        if (!email || !password || !birthYear || !birthMonth || !birthDay || !goal) {
            alert("모든 필드를 입력해주세요!");
            return;
        }


        // 회원가입 성공 후 사용자 정보를 localStorage에 저장
        const user = { name, email };
        localStorage.setItem("user", JSON.stringify(user));

        alert("회원가입 성공!"); // 실제 구현 시 백엔드 API 연동 필요
        navigate("/login");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
                
                {/* 이름 입력 */}
                <input
                    type="name"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                
                {/* 이메일 입력 */}
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* 비밀번호 입력 */}
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* 생년월일 입력 */}
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="YYYY"
                        maxLength="4"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-1/3 p-2 border border-gray-300 rounded-lg text-center"
                    />
                    <input
                        type="text"
                        placeholder="MM"
                        maxLength="2"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="w-1/3 p-2 border border-gray-300 rounded-lg text-center"
                    />
                    <input
                        type="text"
                        placeholder="DD"
                        maxLength="2"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="w-1/3 p-2 border border-gray-300 rounded-lg text-center"
                    />
                </div>

                {/* 건강 목표 선택 */}
                <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">건강 목표 선택</option>
                    <option value="체중 감량">체중 감량</option>
                    <option value="근육 증가">근육 증가</option>
                    <option value="건강 유지">건강 유지</option>
                    <option value="균형 잡힌 식단">균형 잡힌 식단</option>
                    <option value="식단 개선">식단 개선</option>
                </select>

                {/* 알레르기 입력 */}
                <input
                    type="text"
                    placeholder="알레르기 정보 (예: 땅콩, 해산물)"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {/* 건강 특성 체크박스 */}
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">건강 특성 (선택)</p>
                    {healthOptions.map((option) => (
                        <label key={option} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={healthConditions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>


                {/* 회원가입 버튼 */}
                <button
                    onClick={handleSignup}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                    회원가입
                </button>

                {/* 로그인 이동 버튼 */}
                <p className="text-center mt-4 text-gray-500">
                    이미 계정이 있으신가요?
                    <button onClick={() => navigate("/login")} className="text-blue-500 ml-1 hover:underline">
                        로그인
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignupComponent;
