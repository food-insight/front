import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AnalysisComponent() {
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [openStates, setOpenStates] = useState({});
    const [currentWeek, setCurrentWeek] = useState(0);

    useEffect(() => {
        const meals = ["오트밀", "연어 스테이크", "닭가슴살 샐러드"];
        const dummyData = [];
        const dates = Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setUTCDate(date.getUTCDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse();

        dates.forEach((date) => {
            const dayData = [
                { meal: "아침", name: meals[0], carbs: Math.floor(Math.random() * 100) + 20, protein: Math.floor(Math.random() * 60) + 10, fat: Math.floor(Math.random() * 50) + 5, totalCalories: Math.floor(Math.random() * 500) + 100 },
                { meal: "점심", name: meals[1], carbs: Math.floor(Math.random() * 100) + 20, protein: Math.floor(Math.random() * 60) + 10, fat: Math.floor(Math.random() * 50) + 5, totalCalories: Math.floor(Math.random() * 500) + 100 },
                { meal: "저녁", name: meals[2], carbs: Math.floor(Math.random() * 100) + 20, protein: Math.floor(Math.random() * 60) + 10, fat: Math.floor(Math.random() * 50) + 5, totalCalories: Math.floor(Math.random() * 500) + 100 },
            ];

            dayData.forEach((entry) => {
                dummyData.push({
                    date: date,
                    meal: entry.meal,
                    food: entry.name,
                    carbs: entry.carbs,
                    protein: entry.protein,
                    fat: entry.fat,
                    totalCalories: entry.totalCalories
                });
            });
        });

        setAnalysisHistory(dummyData);
    }, []);

    const dailyData = {};
    analysisHistory.forEach((entry) => {
        if (!dailyData[entry.date]) {
            dailyData[entry.date] = { carbs: 0, protein: 0, fat: 0, totalCalories: 0 };
        }
        dailyData[entry.date].carbs += entry.carbs;
        dailyData[entry.date].protein += entry.protein;
        dailyData[entry.date].fat += entry.fat;
        dailyData[entry.date].totalCalories += entry.totalCalories;
    });

    const allDates = Object.keys(dailyData).sort();
    const startIdx = currentWeek * 7;
    const endIdx = startIdx + 7;
    const visibleDates = allDates.slice(startIdx, endIdx);

    const chartData = {
        labels: visibleDates,
        datasets: [
            {
                label: "탄수화물 (g)",
                data: visibleDates.map((d) => dailyData[d]?.carbs || 0),
                borderColor: "rgb(255, 99, 132)",
                fill: false,
            },
            {
                label: "단백질 (g)",
                data: visibleDates.map((d) => dailyData[d]?.protein || 0),
                borderColor: "rgb(54, 162, 235)",
                fill: false,
            },
            {
                label: "지방 (g)",
                data: visibleDates.map((d) => dailyData[d]?.fat || 0),
                borderColor: "rgb(255, 206, 86)",
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "일별 영양소 섭취량",
            },
            legend: {
                position: "bottom",
            },
            interaction: {
                intersect: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => value + " g",
                },
            },
        },
        elements: {
            point: {
                radius: 4,
                borderWidth: 3,
            },
        },
    };

    const toggleOpenState = (date, meal) => {
        setOpenStates((prevState) => {
            const key = `${date}-${meal}`;
            return {
                ...prevState,
                [key]: !prevState[key],
            };
        });
    };

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <div className="w-full pr-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">식단 분석 결과</h2>
                <div className="relative w-full flex justify-center items-center mt-8">
                    <button
                        className="absolute left-48 top-1/2 -translate-y-1/2 text-blue-500 w-10 h-10 bg-gray-50 rounded-[10px] hover:bg-gray-200"
                        onClick={() => setCurrentWeek((prev) => Math.max(prev - 1, 0))}
                        disabled={currentWeek === 0}
                    >
                        ◀
                    </button>


                    {/* 차트 */}
                    <div className="w-full flex flex-col items-center">
                        {analysisHistory.length > 0 && (
                            <div className="h-96 w-full lg:w-1/2">
                                <Line data={chartData} options={options}/>
                            </div>
                        )}
                    </div>

                    {/* 다음 주 버튼 */}
                    <button
                        className="absolute right-48 top-1/2 -translate-y-1/2 text-blue-500 w-10 h-10 bg-gray-50 rounded-[10px] hover:bg-gray-200"
                        onClick={() => setCurrentWeek((prev) => prev + 1)}
                        disabled={endIdx >= allDates.length}
                    >
                        ▶
                    </button>
                </div>


                {analysisHistory.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {visibleDates.map((date) => (
                            <div key={date} className="bg-white p-6 rounded-lg shadow-lg border space-y-4">
                                <h3 className="text-lg font-semibold mb-2">{date}</h3>
                                <div className="space-y-4">
                                    {["아침", "점심", "저녁"].map((meal, idx) => {
                                        const mealData = analysisHistory.find((entry) => entry.date === date && entry.meal === meal);
                                        const isOpen = openStates[`${date}-${meal}`];
                                        return mealData ? (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-medium">🍎 {meal}: {mealData.food}</p>
                                                    <button className="text-blue-500"
                                                            onClick={() => toggleOpenState(date, meal)}>
                                                        {isOpen ? "↩" : "↩"}
                                                    </button>
                                                </div>
                                                {isOpen && (
                                                    <div className="space-y-2">
                                                        <p>￮ 탄수화물: {mealData.carbs}g</p>
                                                        <p>￮ 단백질: {mealData.protein}g</p>
                                                        <p>￮ 지방: {mealData.fat}g</p>
                                                        <p>￮ 칼로리: {mealData.totalCalories} kcal</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null;
                                    })}
                                    <div className="mt-4">
                                        <p className="font-medium">🍽️ 총
                                            칼로리: {dailyData[date].totalCalories} kcal</p>
                                    </div>
                                    <div
                                        className="mt-4 text-sm text-gray-500">{dailyData[date].totalCalories > 1500 ? "너무 많이 드셨어요!" : "균형 잡힌 식사입니다!"}</div>

                            </div>
                            </div>
                            ))}
                    </div>
                    )}
            </div>
        </div>
    );
}

export default AnalysisComponent;
