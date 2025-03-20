import React, { useState, useEffect } from "react";
import axios from "axios"; // API 요청을 위한 axios 임포트

function RecommendComponent() {
    const [userInfo, setUserInfo] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchMealPlan = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/recommendations/meal", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MjQ0Njk5MiwianRpIjoiMDc3ODA1MTktMWJiNy00ODE4LTlhYjgtZDgxZTZjMDNmNmRjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDI0NDY5OTIsImNzcmYiOiJkMDlmMTMwMi0yNGNjLTRiNWQtYTg5NS1hYjY1OTRlODhlNTgiLCJleHAiOjE3NDI1MzMzOTJ9.4zWk4-uAr9WYkKHov5yHcGaBkaSIQW6lRnri16PRmRw")}`, // 헤더에 토큰 추가
                    }
                });
                if (response.data.success) {
                    setUserInfo(response.data.data);
                    setMealPlan(response.data.data.recommendations);
                }
            } catch (error) {
                console.error("식단 추천을 불러오는 데 오류가 발생했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealPlan();
    }, []);

    // 전체 칼로리 계산
    const totalKcal = mealPlan ? mealPlan.balanced_meal.reduce((sum, meal) => sum + (meal.kcal || 0), 0) : 0;

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">맞춤식단 추천</h2>
            {userInfo && <h2 className="text-lg font-semibold text-gray-700 mt-4">💪 {userInfo.name}님의 목표: {userInfo.health_goal}</h2>}

            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
                {loading ? (
                    <p className="text-gray-500 text-center">식단을 불러오는 중...</p>
                ) : mealPlan ? (
                    <>
                        <p className="text-lg font-semibold text-gray-800 mb-3">오늘의 추천 식단</p>
                        <ul className="space-y-4">
                            {/* 균형 잡힌 식사 추천 */}
                            <p className="text-lg font-semibold text-gray-800 mb-3">균형 잡힌 식사</p>
                            {mealPlan.balanced_meal.map((meal, index) => (
                                <li key={index} className="text-lg bg-white p-4 rounded-lg shadow-md">
                                    <div className="font-semibold">{meal.name}</div>
                                    <div className="text-gray-700 mt-2">{meal.reason}</div>
                                </li>
                            ))}

                            {/* 건강에 기반한 식품 추천 */}
                            <p className="text-lg font-semibold text-gray-800 mb-3 mt-4">건강에 기반한 식품</p>
                            {mealPlan.health_based.map((item, index) => (
                                <li key={index} className="text-lg bg-white p-4 rounded-lg shadow-md">
                                    <div className="font-semibold">{item.name}</div>
                                    <div className="text-gray-700 mt-2">{item.reason}</div>
                                </li>
                            ))}

                            {/* 다양성에 기반한 식품 추천 */}
                            <p className="text-lg font-semibold text-gray-800 mb-3 mt-4">식단의 다양성 높이기</p>
                            {mealPlan.variety_based.map((item, index) => (
                                <li key={index} className="text-lg bg-white p-4 rounded-lg shadow-md">
                                    <div className="font-semibold">{item.name}</div>
                                    <div className="text-gray-700 mt-2">{item.reason}</div>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-6 text-lg font-semibold text-gray-800">총 칼로리: {totalKcal} kcal</p>
                    </>
                ) : (
                    <p className="text-gray-500 text-center">추천 식단이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default RecommendComponent;
