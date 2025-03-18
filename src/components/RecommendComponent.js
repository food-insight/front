import React, { useState, useEffect } from "react";
import { useRecipeContext } from "../router/recipeContext"; // RecipeContext에서 hook 가져오기
import { recipes } from "./RecipeComponent"; // recipes 배열을 가져옵니다

function RecommendComponent() {
    const [userInfo, setUserInfo] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    // RecipeContext에서 selectedRecipe와 isModalOpen 상태 가져오기
    const { selectedRecipe, setSelectedRecipe, isModalOpen, setIsModalOpen } = useRecipeContext();

    useEffect(() => {
        const dummyUserInfo = {
            name: "홍길동",
            health_goal: "체중 감량"
        };
        const dummyMealPlan = {
            meals: {
                "아침": { name: "오트밀", kcal: 250, carbs: 40, protein: 8, fat: 5, info: "오트밀은 식이섬유가 풍부하여 포만감을 오래 유지하는 데 도움을 줍니다." },
                "점심": { name: "닭가슴살 샐러드", kcal: 350, carbs: 20, protein: 40, fat: 10, info: "단백질이 풍부하여 근육량 유지 및 체중 감량에 효과적입니다." },
                "저녁": { name: "고구마 구이", kcal: 150, carbs: 35, protein: 3, fat: 1, info: "복합 탄수화물로 혈당을 천천히 올려 안정적인 에너지를 제공합니다." },
                "간식": { name: "단백질 쉐이크", kcal: 200, carbs: 10, protein: 25, fat: 5, info: "운동 후 빠른 단백질 보충을 도와 근육 회복에 좋습니다." }
            },
            recommendation: "✅ 하루에 3번 균형 잡힌 식사와 충분한 수분 섭취를 추천합니다."
        };

        setUserInfo(dummyUserInfo);
        setMealPlan(dummyMealPlan);
        setLoading(false);
    }, []);

    const totalKcal = mealPlan ? Object.values(mealPlan.meals).reduce((sum, meal) => sum + meal.kcal, 0) : 0;

    const openRecipeModal = (mealName) => {
        // recipes의 값들에서 title과 mealName을 비교하여 레시피를 찾음
        const recipe = Object.values(recipes).find(recipe => recipe.title === mealName);

        if (recipe) {
            setSelectedRecipe(recipe);
            setIsModalOpen(true);
        } else {
            console.error("해당 레시피가 존재하지 않습니다.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

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
                            {Object.entries(mealPlan.meals).map(([mealType, meal]) => (
                                <li key={mealType} className="text-lg bg-white p-4 rounded-lg shadow-md">
                                    <button
                                        onClick={() => openRecipeModal(meal.name)} // 레시피 모달을 열기 위한 버튼
                                        className="text-blue-600 font-semibold hover:text-blue-800"
                                    >
                                        🍎 {mealType}: {meal.name}
                                    </button>
                                    <div className="mt-2 text-gray-700">
                                        <p>칼로리: <span className="font-semibold">{meal.kcal} kcal</span></p>
                                        <p>탄수화물: <span className="font-semibold">{meal.carbs}g</span> | 단백질: <span className="font-semibold">{meal.protein}g</span> | 지방: <span className="font-semibold">{meal.fat}g</span></p>
                                        <p className="mt-2 text-gray-600 italic">{meal.info}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-lg font-semibold text-gray-800">총 칼로리: {totalKcal} kcal</p>
                        <p className="mt-2 text-gray-600">{mealPlan.recommendation}</p>
                    </>
                ) : (
                    <p className="text-gray-500 text-center">추천 식단이 없습니다.</p>
                )}
            </div>

            {/* 모달창 추가 */}
            {isModalOpen && selectedRecipe && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 max-w-2xl mx-auto rounded-lg"
                        onClick={(e) => e.stopPropagation()} // 모달 외부 클릭 시 모달 닫기 방지
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
                        <img
                            src={selectedRecipe.image}
                            alt={selectedRecipe.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">📌 재료</h3>
                        <ul className="list-disc list-inside space-y-1 mb-4">
                            {selectedRecipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-gray-700">{ingredient}</li>
                            ))}
                        </ul>
                        <h3 className="text-lg font-semibold mb-2">👩‍🍳 조리법</h3>
                        <ol className="list-decimal list-inside space-y-2">
                            {selectedRecipe.steps.map((step, index) => (
                                <li key={index} className="text-gray-700">{step}</li>
                            ))}
                        </ol>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 font-semibold text-gray-600 hover:text-blue-500"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecommendComponent;
