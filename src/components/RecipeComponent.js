import React, { useState, useEffect } from 'react';

// 레시피 컴포넌트
function RecipeComponent() {
    const [recipes, setRecipes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 임시로 넣은 토큰 (나중에 로그인 로직에서 동적으로 할당해야 함....)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MjQ1MzkzNSwianRpIjoiNjg5YjVjMmQtZGZkNC00NGE2LWExZmEtYTU2N2RiM2NjMTM0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDI0NTM5MzUsImNzcmYiOiI5NzNiY2NkOS1mY2ZlLTQ2NTMtODk3YS03ODY5NWUwMTQ4ZTQiLCJleHAiOjE3NDI1NDAzMzV9.OOVvXE8SbegLmJC4-9mJRyGDysqPE5olwoxgA36usEE";

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

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/recommendations/recipes?ingredients=닭고기,마늘&meal_type=저녁&health_goal=단백질이많은', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // 헤더에 사용자 토큰 포함
                    }
                });

                if (!response.ok) {
                    throw new Error('레시피 데이터를 불러오는 데 실패했습니다.');
                }

                const data = await response.json();
                setRecipes(data.data.recipes);
            } catch (error) {
                setError(error.message);
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
                            className="bg-white p-4 shadow-lg rounded-lg cursor-pointer"
                            onClick={() => handleClick(recipe)}
                        >
                            <img
                                src={recipe.image || '/images/default.jpg'}
                                alt={recipe.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <h3 className="text-xl font-semibold text-center mt-2">{recipe.title}</h3>
                        </div>
                    ))}
                </div>

                {/* 모달: 레시피 상세보기 */}
                {isModalOpen && selectedRecipe && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                        <div className="bg-white p-6 max-w-2xl mx-auto rounded-lg" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
                            <img
                                src={selectedRecipe.image || '/images/default.jpg'}
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
                                {selectedRecipe.instructions.split('\n').map((step, index) => (
                                    <li key={index} className="text-gray-700">{step}</li>
                                ))}
                            </ol>
                            <button onClick={closeModal} className="mt-4 px-4 py-2 font-semibold text-gray-600 hover:text-blue-500">
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
