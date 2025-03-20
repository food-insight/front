import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import API_SERVER_HOST from "../api/apiConfig";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalysisComponent = () => {
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [nutritionalInfo, setNutritionalInfo] = useState({});
    const [currentWeek, setCurrentWeek] = useState(0);
    const [visibleFoodInfo, setVisibleFoodInfo] = useState({});  // 상태 추가
   // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MjQ1MzkzNSwianRpIjoiNjg5YjVjMmQtZGZkNC00NGE2LWExZmEtYTU2N2RiM2NjMTM0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NDI0NTM5MzUsImNzcmYiOiI5NzNiY2NkOS1mY2ZlLTQ2NTMtODk3YS03ODY5NWUwMTQ4ZTQiLCJleHAiOjE3NDI1NDAzMzV9.OOVvXE8SbegLmJC4-9mJRyGDysqPE5olwoxgA36usEE';

// localStorage에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");
    console.log("로그--->",token);

    useEffect(() => {
        if (!token) {
            console.error("토큰이 없습니다. 로그인이 필요합니다.");
            return;
        }

        fetch(`${API_SERVER_HOST}/meals/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const meals = [];
                const mealData = [];

                data.meals.forEach((meal) => {
                    const mealDate = meal.date;
                    meal.foods.forEach((food) => {
                        meals.push(food.food_name);
                        mealData.push({
                            date: mealDate,
                            meal: meal.meal_time,
                            food: food.food_name
                        });
                    });
                });

                meals.forEach((foodName) => {
                    fetch(`${API_SERVER_HOST}/nutrition?food=${foodName}&quantity=100&source=rag&unit=g`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                        .then((response) => response.json())
                        .then((nutritionData) => {
                            const description = nutritionData.nutrients.description;
                            const nutrients = {
                                calories: extractNutrient(description, '칼로리'),
                                carbs: extractNutrient(description, '탄수화물'),
                                protein: extractNutrient(description, '단백질'),
                                fat: extractNutrient(description, '지방')
                            };

                            setNutritionalInfo((prev) => ({
                                ...prev,
                                [foodName]: nutrients
                            }));
                        })
                        .catch((error) => {
                            console.error('영양 정보 조회 중 오류 발생:', error);
                        });
                });

                setAnalysisHistory(mealData);
            })
            .catch((error) => {
                console.error('식단 정보 조회 중 오류 발생:', error);
            });
    }, [token]);

    const extractNutrient = (description, nutrient) => {
        const regex = new RegExp(`${nutrient}:\\s*(\\d+\\.?\\d*)`, 'g');
        const match = regex.exec(description);
        return match ? match[1] : '정보 없음';
    };
    const dailyData = {};
    analysisHistory.forEach((entry) => {
        if (!dailyData[entry.date]) {
            dailyData[entry.date] = { carbs: 0, protein: 0, fat: 0, totalCalories: 0, meals: {} };
        }
        if (nutritionalInfo[entry.food]) {
            dailyData[entry.date].carbs += parseFloat(nutritionalInfo[entry.food].carbs) || 0;
            dailyData[entry.date].protein += parseFloat(nutritionalInfo[entry.food].protein) || 0;
            dailyData[entry.date].fat += parseFloat(nutritionalInfo[entry.food].fat) || 0;
            dailyData[entry.date].totalCalories += parseFloat(nutritionalInfo[entry.food].calories) || 0;

            if (!dailyData[entry.date].meals[entry.meal]) {
                dailyData[entry.date].meals[entry.meal] = [];
            }
            dailyData[entry.date].meals[entry.meal].push(entry.food);
        }
    });

    const allDates = Object.keys(dailyData).sort();
    const startIdx = currentWeek * 7;
    const endIdx = startIdx + 7;
    const visibleDates = allDates.slice(startIdx, endIdx);

    const chartData = {
        labels: visibleDates,
        datasets: [
            {
                label: '탄수화물 (g)',
                data: visibleDates.map((d) => dailyData[d]?.carbs || 0),
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
            },
            {
                label: '단백질 (g)',
                data: visibleDates.map((d) => dailyData[d]?.protein || 0),
                borderColor: 'rgb(54, 162, 235)',
                fill: false,
            },
            {
                label: '지방 (g)',
                data: visibleDates.map((d) => dailyData[d]?.fat || 0),
                borderColor: 'rgb(255, 206, 86)',
                fill: false,
            },
        ],
    };

    // 음식 정보 보이기/숨기기 토글
    const toggleFoodInfo = (date, meal, food) => {
        setVisibleFoodInfo((prev) => ({
            ...prev,
            [`${date}-${meal}-${food}`]: !prev[`${date}-${meal}-${food}`]
        }));
    };

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">식단 분석 결과</h2>

            <div className="relative w-full flex justify-center items-center mt-8">
                <button
                    className="absolute left-48 top-1/2 -translate-y-1/2 text-blue-500 w-10 h-10 bg-gray-50 rounded-[10px] hover:bg-gray-200"
                    onClick={() => setCurrentWeek((prev) => Math.max(prev - 1, 0))}
                    disabled={currentWeek === 0}
                >
                    ◀
                </button>

                <div className="w-full flex flex-col items-center">
                    {analysisHistory.length > 0 && (
                        <div className="h-96 w-full lg:w-1/2">
                            <p>일별 영양소 섭취량</p>
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    )}
                </div>

                <button
                    className="absolute right-48 top-1/2 -translate-y-1/2 text-blue-500 w-10 h-10 bg-gray-50 rounded-[10px] hover:bg-gray-200"
                    onClick={() => setCurrentWeek((prev) => prev + 1)}
                    disabled={endIdx >= allDates.length}
                >
                    ▶
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {visibleDates.map((date) => (
                    <div key={date} className="bg-white p-6 rounded-lg shadow-lg border space-y-4">
                        <h3 className="text-lg font-semibold">{date}</h3>
                        {['아침', '점심', '저녁'].map((meal) => {
                            const mealFoods = dailyData[date]?.meals[meal] || [];
                            return mealFoods.length > 0 ? (
                                <div key={meal} className="space-y-2">
                                    <p className="font-medium">🍎 {meal}</p>
                                    <ul className="list-disc pl-4">
                                        {mealFoods.map((food) => {
                                            const isFoodVisible = visibleFoodInfo[`${date}-${meal}-${food}`];
                                            return (
                                                <p key={food}>
                                                    <button
                                                        onClick={() => toggleFoodInfo(date, meal, food)}
                                                    >
                                                        ➡️{food}
                                                    </button>
                                                    : {nutritionalInfo[food]?.calories || '정보 없음'} kcal
                                                    {isFoodVisible && (
                                                        <div className="space-y-1 mt-2">
                                                            <ul>탄수화물: {nutritionalInfo[food]?.carbs}g</ul>
                                                            <ul>단백질: {nutritionalInfo[food]?.protein}g</ul>
                                                            <ul>지방: {nutritionalInfo[food]?.fat}g</ul>
                                                        </div>
                                                    )}
                                                </p>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : null;
                        })}
                        <p className="font-medium mt-4">총 칼로리: {dailyData[date]?.totalCalories || 0} kcal</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalysisComponent;
