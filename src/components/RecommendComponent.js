import React, { useState, useEffect } from "react";
import axios from "axios"; // API 요청을 위한 axios 임포트
import { getCookie } from "../util/cookieUtil";

function RecommendComponent() {
    const [userInfo, setUserInfo] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [similarFoods, setSimilarFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteFood, setFavoriteFood] = useState(""); // 사용자로부터 입력받은 음식

    useEffect(() => {
        // userInfo를 localStorage에서 가져오기
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (userInfo === null) {
            return;
        }

        const token = getCookie("accessToken").replace("Bearer ", "");

        // 식단 추천 API 호출
        const fetchMealPlan = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/recommend/meal", {
                    preferences: [userInfo.health_goal],
                    restrictions: []
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.data) {
                    setMealPlan(response.data);
                }
            } catch (error) {
                console.error("식단 추천을 불러오는 데 오류가 발생했습니다.", error);
            }
        };

        fetchMealPlan();
        setLoading(false);

    }, [userInfo]); // 초기 식단만 불러오는 useEffect

    // 유사 음식 추천 API 호출
    const fetchSimilarFoods = async () => {
        try {
            const food = favoriteFood || "두부"; // 기본값을 두부로 설정
            const response = await axios.get(`http://localhost:5000/api/recommend/similar?food=${food}&limit=5`);

            if (response.data) {
                setSimilarFoods(response.data.similar_foods);
            }
        } catch (error) {
            console.error("유사 음식을 불러오는 데 오류가 발생했습니다.", error);
        }
    };

    // 사용자가 엔터를 눌렀을 때 유사 음식을 추천
    const handleFoodSubmit = (e) => {
        if (e.key === "Enter") {
            fetchSimilarFoods(); // 엔터 키를 눌렀을 때 유사 음식을 추천
        }
    };

    // 전체 칼로리 계산 (추천된 식단을 기준으로)
    const totalKcal = mealPlan ? mealPlan.reduce((sum, meal) => sum + (meal.calories || 0), 0) : 0;

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">맞춤식단 추천</h2>
            {userInfo && userInfo.name && (
                <p>💪 {userInfo.name}님의 건강 목표: <strong>{userInfo.health_goal}</strong></p>
            )}

            <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
                {loading ? (
                    <p className="text-gray-500 text-center">식단을 불러오는 중...</p>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-800 mb-3">오늘의 추천 식단</p>
                        <ul className="space-y-4">
                            {/* 아침, 점심, 저녁을 순서대로 표시 */}
                            {mealPlan && mealPlan.map((meal, index) => {
                                let mealTime = "";
                                if (index === 0) {
                                    mealTime = "🍎 아침";
                                } else if (index === 1) {
                                    mealTime = "🍎 점심";
                                } else if (index === 2) {
                                    mealTime = "🍎 저녁";
                                }

                                return (
                                    <div key={index}>
                                        <p className="text-lg font-semibold text-gray-800 mb-3">{mealTime}</p>
                                        <li className="text-lg bg-white p-4 rounded-lg shadow-md">
                                            <div className="font-semibold">{meal.recommended_meal}</div>
                                            <div className="text-gray-700 mt-2">
                                                <p>칼로리: {meal.calories} kcal</p>
                                                <p>탄수화물: {meal.carbs} g</p>
                                                <p>단백질: {meal.protein} g</p>
                                                <p>지방: {meal.fats} g</p>
                                            </div>
                                        </li>
                                    </div>
                                );
                            })}
                        </ul>

                        <p className="mt-6 text-lg font-semibold text-gray-800">총 칼로리: {totalKcal} kcal</p>

                        {/* 유사 음식 추천 */}
                        <div className="mt-6">
                            <p className="text-lg font-semibold text-gray-800 mb-3">유사 음식 추천</p>
                            {/* 음식 입력 필드 */}
                            <input
                                type="text"
                                value={favoriteFood}
                                onChange={(e) => setFavoriteFood(e.target.value)}
                                onKeyDown={handleFoodSubmit}  // 엔터 키 눌렀을 때 submit
                                placeholder="유사 음식 추천을 원하시면 음식을 입력하세요"
                                className="w-full p-2 rounded-lg border border-gray-300 mb-4"
                            />
                            <ul className="space-y-4">
                                {similarFoods.map((food, index) => (
                                    <li key={index} className="text-lg bg-white p-4 rounded-lg shadow-md">
                                        <div className="font-semibold">{food.name}</div>
                                        <div className="text-gray-700 mt-2">{food.reason}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RecommendComponent;
