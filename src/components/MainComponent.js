import React from "react";

function MainComponent(props) {
    return (
        <div className="w-full max-w-screen-xl mx-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">오늘의 식단</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li>🕖 아침: 오트밀</li>
                        <li>🍴 점심: 샐러드</li>
                        <li>🍽 저녁: 닭가슴살</li>
                    </ul>
                    <div className="text-center">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="오늘의 추천 메뉴"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">오늘의 목표</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li>🥗 칼로리: 1800/2000</li>
                        <li>💪 단백질: 50g/60g</li>
                    </ul>
                    <div className="text-center">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="목표 달성"
                            className="rounded-lg shadow-lg w-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">칼로리 계산기</h2>
                    <p className="text-gray-600">오늘 먹은 음식을 입력하여 칼로리를 계산해보세요!</p>
                    <input
                        type="text"
                        placeholder="음식을 입력하세요..."
                        className="mt-4 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                        계산하기
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">추천 레시피</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="number"
                                placeholder="칼로리 목표"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="ml-2 text-gray-700">kcal</span>
                        </div>
                        <button
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all">
                            설정하기
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700">식단 목표 설정</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center border-b pb-4 bg-gray-50 p-4 rounded">
                        <div className="text-gray-700">닭가슴살 샐러드</div>
                        <button className="text-blue-500 hover:underline">레시피 보기</button>
                    </div>
                    <div className="flex justify-between items-center border-b pb-4 bg-gray-50 p-4 rounded">
                        <div className="text-gray-700">연어 스테이크</div>
                        <button className="text-blue-500 hover:underline">레시피 보기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainComponent;