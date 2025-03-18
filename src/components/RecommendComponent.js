import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function RecommendComponent() {
    const [userInfo, setUserInfo] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 더미 데이터
        const dummyUserInfo = {
            name: "홍길동",
            health_goal: "체중 감량"
        };
        const dummyMealPlan = {
            recommendedMeals: ["닭가슴살 샐러드", "고구마", "단백질 쉐이크"],
            recommendation: "✅ 하루에 3번 균형 잡힌 식사를 추천합니다."
        };

        setUserInfo(dummyUserInfo);
        setMealPlan(dummyMealPlan);
        setLoading(false);
    }, []);

    // 한글 메뉴명을 URL-friendly한 영어로 변환하는 매핑
    const mealRoutes = {
        "닭가슴살 샐러드": "chicken-salad",
        "고구마": "sweet-potato",
        "단백질 쉐이크": "protein-shake"
    };

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <div className="flex p-6 flex-col">
                <div className="w-full pr-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4">맞춤식단 추천</h2>

                    {userInfo ? (
                        <h2 className="text-lg font-semibold text-gray-700 mt-4">💪 {userInfo.name}님의 목표: {userInfo.health_goal}</h2>
                    ) : (
                        <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
                    )}

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-md">
                        {loading ? (
                            <p className="text-gray-500 text-center">식단을 불러오는 중...</p>
                        ) : mealPlan ? (
                            <>
                                <p className="text-lg font-semibold text-gray-800 mb-3">추천 음식</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {mealPlan.recommendedMeals.map((item, index) => (
                                        <li key={index} className="text-lg">
                                            <Link to={`/recipe/${mealRoutes[item]}`}>
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-gray-600">{mealPlan.recommendation}</p>
                            </>
                        ) : (
                            <p className="text-gray-500 text-center">추천 식단이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecommendComponent;
