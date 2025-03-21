import React, { useState, useEffect } from 'react';
import API_SERVER_HOST from "../api/apiConfig";
import { getCookie } from "../util/cookieUtil";

// 레시피 컴포넌트
function RecipeComponent() {
    const [recipes, setRecipes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = getCookie("accessToken").replace("Bearer ", "");


    // 랜덤 요소 추출 함수
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // 레시피 검색
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 여러 배열 추가
    const ingredientsList = ["두부", "닭가슴살", "연어", "브로콜리", "고구마", "소고기", "콩나물"];
    const mealTypes = ["아침", "점심", "저녁"];
    const healthGoals = ["단백질이많은", "저탄수화물", "저지방", "고탄수화물"];

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);

            try {
                const recipesPromises = [];

                // 여러 개의 레시피를 가져오기 위해 반복
                for (let i = 0; i < 3; i++) {
                    const randomIngredient = getRandomElement(ingredientsList);
                    const randomMealType = getRandomElement(mealTypes);
                    const randomHealthGoal = getRandomElement(healthGoals);

                    const apiUrl = `${API_SERVER_HOST}/recommendations/recipes?ingredients=${randomIngredient}&meal_type=${randomMealType}&health_goal=${randomHealthGoal}`;
                    const promise = fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }).then((response) => response.json());

                    recipesPromises.push(promise);
                }

                const results = await Promise.all(recipesPromises);  // 모든 API 호출 결과를 기다림

                // 여러 페이지의 레시피 데이터를 합침
                const allRecipes = results.reduce((acc, data) => {
                    return [...acc, ...data.data.recipes];
                }, []);

                setRecipes(allRecipes);  // 모든 레시피를 상태에 설정
            } catch (error) {
                setError('레시피 데이터를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [token]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">추천 레시피</h2>
            {/* 검색창 */}
            <div className="flex justify-end mb-4 w-full">
                <input
                    type="text"
                    placeholder="레시피를 검색하세요"
                    className="p-2 border border-gray-300 rounded-lg r-40 mb-4"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-blue-50 p-4 shadow-lg rounded-lg cursor-pointer"
                            onClick={() => handleClick(recipe)}
                        >
                            <h3 className="text-xl font-semibold text-center mt-2">{recipe.title}</h3>
                        </div>
                    ))}
                </div>

                {/* 모달: 레시피 상세보기 */}
                {isModalOpen && selectedRecipe && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                        <div className="bg-white p-6 max-w-2xl mx-auto rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
                            <h3 className="text-lg font-semibold mb-2">📌 재료</h3>
                            <ul className="list-disc list-inside space-y-1 mb-4">
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="text-gray-700">{ingredient}</li>
                                ))}
                            </ul>

                            <h3 className="text-lg font-semibold mb-2">👩‍🍳 조리법</h3>
                            <ul className="list-decimal list-inside space-y-2">
                                {selectedRecipe.instructions.split('\n').map((step, index) => (
                                    <li key={index} className="text-gray-700">{step.replace(/^\d+\.\s*/, '')}</li>
                                ))}
                            </ul>
                            <button onClick={closeModal}
                                    className="mt-4 px-4 py-2 font-semibold text-gray-600 hover:text-blue-500">
                                닫기
                            </button>


                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeComponent;
