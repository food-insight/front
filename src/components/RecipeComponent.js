import React, { useState } from 'react';

// 더미 레시피 데이터
export const recipes = {
    "chicken-salad": {
        title: "닭가슴살 샐러드",
        image: "/images/chicken-salad.jpg",
        ingredients: [
            "닭가슴살 150g",
            "양상추 50g",
            "방울토마토 5개",
            "오이 1/2개",
            "올리브오일 1큰술",
            "발사믹 드레싱 2큰술",
            "소금, 후추 약간"
        ],
        steps: [
            "닭가슴살을 끓는 물에 10분간 삶은 후 먹기 좋은 크기로 찢는다.",
            "양상추를 깨끗이 씻고 한 입 크기로 썬다.",
            "방울토마토는 반으로 자르고 오이는 얇게 슬라이스한다.",
            "그릇에 모든 재료를 담고 올리브오일과 발사믹 드레싱을 뿌린다.",
            "소금과 후추로 간을 맞춘 후 골고루 섞어 완성한다."
        ]
    },
    "sweet-potato": {
        title: "고구마 구이",
        image: "/images/sweet-potato.jpg",
        ingredients: [
            "고구마 2개",
            "버터 1큰술 (선택)",
            "꿀 또는 시럽 1큰술 (선택)",
            "계피가루 약간"
        ],
        steps: [
            "고구마를 깨끗이 씻고 껍질째 오븐에 넣는다.",
            "200도로 예열한 오븐에서 40분간 굽는다. (중간에 한 번 뒤집는다)",
            "구운 고구마를 반으로 갈라 버터를 올려 녹인다. (선택)",
            "더 달콤하게 먹고 싶다면 꿀이나 시럽을 뿌린다.",
            "마지막으로 계피가루를 뿌려 완성한다."
        ]
    },
    "protein-shake": {
        title: "단백질 쉐이크",
        image: "/images/protein-shake.jpg",
        ingredients: [
            "우유 200ml (또는 아몬드 밀크)",
            "바나나 1개",
            "단백질 파우더 1스쿱",
            "땅콩버터 1큰술 (선택)",
            "꿀 1작은술 (선택)",
            "얼음 5~6개"
        ],
        steps: [
            "믹서기에 우유, 바나나, 단백질 파우더를 넣는다.",
            "더 고소한 맛을 원하면 땅콩버터를 추가한다.",
            "단맛을 원하면 꿀을 넣고 시원하게 마시려면 얼음을 추가한다.",
            "모든 재료를 믹서기로 곱게 간다.",
            "잔에 담아 완성한다."
        ]
    },
    "salmon-steak": {
        title: "연어 스테이크",
        image: "/images/protein-shake.jpg",
        ingredients: [
            "우유 200ml (또는 아몬드 밀크)",
            "바나나 1개",
            "단백질 파우더 1스쿱",
            "땅콩버터 1큰술 (선택)",
            "꿀 1작은술 (선택)",
            "얼음 5~6개"
        ],
        steps: [
            "믹서기에 우유, 바나나, 단백질 파우더를 넣는다.",
            "더 고소한 맛을 원하면 땅콩버터를 추가한다.",
            "단맛을 원하면 꿀을 넣고 시원하게 마시려면 얼음을 추가한다.",
            "모든 재료를 믹서기로 곱게 간다.",
            "잔에 담아 완성한다."
        ]
    },
    "oatmeal": {
        title: "오트밀",
        image: "/images/protein-shake.jpg",
        ingredients: [
            "우유 200ml (또는 아몬드 밀크)",
            "바나나 1개",
            "단백질 파우더 1스쿱",
            "땅콩버터 1큰술 (선택)",
            "꿀 1작은술 (선택)",
            "얼음 5~6개"
        ],
        steps: [
            "믹서기에 우유, 바나나, 단백질 파우더를 넣는다.",
            "더 고소한 맛을 원하면 땅콩버터를 추가한다.",
            "단맛을 원하면 꿀을 넣고 시원하게 마시려면 얼음을 추가한다.",
            "모든 재료를 믹서기로 곱게 간다.",
            "잔에 담아 완성한다."
        ]
    },
    "tomato-pasta": {
        title: "토마토 파스타",
        image: "/images/protein-shake.jpg",
        ingredients: [
            "우유 200ml (또는 아몬드 밀크)",
            "바나나 1개",
            "단백질 파우더 1스쿱",
            "땅콩버터 1큰술 (선택)",
            "꿀 1작은술 (선택)",
            "얼음 5~6개"
        ],
        steps: [
            "믹서기에 우유, 바나나, 단백질 파우더를 넣는다.",
            "더 고소한 맛을 원하면 땅콩버터를 추가한다.",
            "단맛을 원하면 꿀을 넣고 시원하게 마시려면 얼음을 추가한다.",
            "모든 재료를 믹서기로 곱게 간다.",
            "잔에 담아 완성한다."
        ]
    }
};

function RecipePage() {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // 레시피 카드 클릭 시 모달 열기
    const handleClick = (recipeName) => {
        setSelectedRecipe(recipes[recipeName]);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    // 레시피 검색
    const filteredRecipes = Object.keys(recipes).filter((key) => {
        return recipes[key].title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">추천 레시피</h2>
            {/* 검색창 추가 */}
            <div className="flex justify-end mb-4 w-full"  >
            <input
                type="text"
                placeholder="레시피를 검색하세요"
                className="p-2 border border-gray-300 rounded-lg r-40 mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // 입력한 값 상태에 저장
            />
            </div>

            <div className="container mx-auto">

                    <div className="grid grid-cols-3 gap-6">
                        {filteredRecipes.map((recipeKey) => (
                            <div
                                key={recipeKey}
                                className="bg-white p-4 shadow-lg rounded-lg cursor-pointer"
                                onClick={() => handleClick(recipeKey)}
                            >
                                <img
                                    src={recipes[recipeKey].image}
                                    alt={recipes[recipeKey].title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="text-xl font-semibold text-center mt-2">{recipes[recipeKey].title}</h3>
                            </div>
                        ))}
                    </div>

                {/* 모든 레시피를 표시하는 부분 */}
                {filteredRecipes.length === 0 && (
                    <div className="grid grid-cols-3 gap-6">
                        {Object.keys(recipes).map((recipeKey) => (
                            <div
                                key={recipeKey}
                                className="bg-white p-4 shadow-lg rounded-lg cursor-pointer"
                                onClick={() => handleClick(recipeKey)}
                            >
                                <img
                                    src={recipes[recipeKey].image}
                                    alt={recipes[recipeKey].title}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <h3 className="text-xl font-semibold text-center mt-2">{recipes[recipeKey].title}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {/* 모달창: 상세 레시피 */}
                {isModalOpen && selectedRecipe && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
                        <div className="bg-white p-6 max-w-2xl mx-auto rounded-lg" onClick={(e) => e.stopPropagation()}>
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

export default RecipePage;
