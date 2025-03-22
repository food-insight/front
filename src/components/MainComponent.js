import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../util/cookieUtil";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Chart.js 설정
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function MainComponent() {
    const [mealData, setMealData] = useState([]);
    const [proteinGoal, setProteinGoal] = useState("");
    const [carbGoal, setCarbGoal] = useState("");
    const [fatGoal, setFatGoal] = useState("");
    const [caloriesGoal, setCaloriesGoal] = useState("");
    const [goalsSaved, setGoalsSaved] = useState(false);
    const [mealStats, setMealStats] = useState({});
    const [frequentFoods, setFrequentFoods] = useState({});

    const token = getCookie("accessToken").replace("Bearer ", "");

    useEffect(() => {
        axios.get("http://localhost:5000/api/recommendations/meal", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                const balancedMeals = response.data.data.recommendations.balanced_meal;
                setMealData(balancedMeals.slice(0, 3));
            })
            .catch((error) => console.error("Error fetching meal data", error));

        axios.get("http://localhost:5000/api/meals/statistics", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setMealStats(response.data.statistics.grouped_statistics);
                setFrequentFoods(response.data.statistics.most_frequent_foods);
            })
            .catch((error) => console.error("Error fetching meal statistics", error));
    }, []);

    // 목표 저장 함수
    const handleSaveGoals = () => {
        setGoalsSaved(true);
    };

    const barChartData = {
        labels: Object.keys(mealStats),
        datasets: [
            {
                label: '식사 수',
                data: Object.values(mealStats).map(item => item.meals),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieChartData = {
        labels: Object.keys(frequentFoods),
        datasets: [
            {
                label: '식사 빈도수',
                data: Object.values(frequentFoods),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto p-6 space-y-6">
            {/* 상단 카드 뉴스 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 오늘의 영양 식단 */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">오늘의 영양 식단</h2>
                    <ul className="space-y-4 text-gray-600">
                        {mealData.length > 0 ? (
                            mealData.map((meal, index) => (
                                <li key={index} className="text-lg">
                                    <span className="text-lg mr-2">
                                        {index === 0 && "🕖 아침: "}
                                        {index === 1 && "🍴 점심: "}
                                        {index === 2 && "🍽 저녁: "}
                                    </span>
                                    {meal.name}<br/>
                                    <span className="text-sm">{meal.reason}</span>
                                </li>
                            ))
                        ) : (
                            <li>아직 추천된 식단이 없습니다.</li>
                        )}
                    </ul>
                </div>

                {/* 오늘의 목표 */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">오늘의 섭취량 목표</h2>

                    {!goalsSaved ? (
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <input
                                    type="number"
                                    value={carbGoal}
                                    onChange={(e) => setCarbGoal(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="탄수화물 목표 (g)"
                                />
                            </li>
                            <li>
                                <input
                                    type="number"
                                    value={proteinGoal}
                                    onChange={(e) => setProteinGoal(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="단백질 목표 (g)"
                                />
                            </li>
                            <li>
                                <input
                                    type="number"
                                    value={fatGoal}
                                    onChange={(e) => setFatGoal(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="지방 목표 (g)"
                                />
                            </li>
                            <li>
                                <input
                                    type="number"
                                    value={caloriesGoal}
                                    onChange={(e) => setCaloriesGoal(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="칼로리 목표 (kcal)"
                                />
                            </li>
                            <button
                                onClick={handleSaveGoals}
                                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                목표 저장
                            </button>
                        </ul>
                    ) : (
                        <p className="text-lg font-semibold">
                            탄수화물: {carbGoal}g | 단백질: {proteinGoal}g | 지방: {fatGoal}g | 칼로리: {caloriesGoal}kcal
                        </p>
                    )}
                </div>
            </div>

            {/* 차트 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700">식사 횟수</h2>
                    <div className="h-[300px]">
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true, aspectRatio: 2 }} />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700">자주 먹은 음식</h2>
                    <div className="h-[300px]">
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true, aspectRatio: 2 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
