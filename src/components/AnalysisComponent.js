import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AnalysisComponent(props) {
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [openStates, setOpenStates] = useState({});

    useEffect(() => {
        // 더미 데이터 생성 (3일치 아침, 점심, 저녁)
        const meals = ["오트밀", "연어 스테이크", "닭가슴살 샐러드"];
        const dummyData = [];
        const dates = ["2025-03-15", "2025-03-16", "2025-03-17", "2025-03-18", "2025-03-19", "2025-03-20"];

        dates.forEach((date, index) => {
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

    // 날짜별 영양소 합산 데이터 생성 (일별 분석 차트에 사용됨)
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

    // 차트 데이터
    const chartData = {
        labels: Object.keys(dailyData), // 날짜 리스트
        datasets: [
            {
                label: "탄수화물 (g)",
                data: Object.values(dailyData).map((d) => d.carbs),
                borderColor: "rgb(255, 99, 132)",
                fill: false,
            },
            {
                label: "단백질 (g)",
                data: Object.values(dailyData).map((d) => d.protein),
                borderColor: "rgb(54, 162, 235)",
                fill: false,
            },
            {
                label: "지방 (g)",
                data: Object.values(dailyData).map((d) => d.fat),
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

    // 상세 정보 열기/닫기 상태 변경 함수
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
            <div className="flex p-6 flex-col">
                <div className="w-full pr-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4">식단 분석 결과</h2>

                    {/* 차트 아래로 이동 */}
                    <div className="w-full mt-8 flex flex-col items-center space-y-4">
                        {/* 차트 */}
                        {analysisHistory.length > 0 && (
                            <div className="h-96 w-full lg:w-1/2">
                                <Line data={chartData} options={options} />
                            </div>
                        )}
                    </div>

                    {/* 기록된 모든 분석 결과 */}
                    {analysisHistory.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {Object.keys(dailyData).map((date) => (
                                <div key={date} className="bg-white p-6 rounded-lg shadow-lg border space-y-4">
                                    <h3 className="text-lg font-semibold mb-2">{date}</h3>
                                    <div className="space-y-4">
                                        {["아침", "점심", "저녁"].map((meal, idx) => {
                                            const mealData = analysisHistory.filter(
                                                (entry) => entry.date === date && entry.meal === meal
                                            )[0];

                                            const isOpen = openStates[`${date}-${meal}`];

                                            return (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium">🍎 {meal}: {mealData?.food}</p>
                                                        <button
                                                            className="text-blue-500"
                                                            onClick={() => toggleOpenState(date, meal)}
                                                        >
                                                            {isOpen ? "↩" : "↩"}
                                                        </button>
                                                    </div>
                                                    {isOpen && (
                                                        <div className="space-y-2">
                                                            <p>￮ 탄수화물: {mealData?.carbs}g</p>
                                                            <p>￮ 단백질: {mealData?.protein}g</p>
                                                            <p>￮ 지방: {mealData?.fat}g</p>
                                                            <p>￮ 칼로리: {mealData?.totalCalories} kcal</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <div className="mt-4">
                                            <p className="font-medium">🍽️ 총 칼로리: {dailyData[date].totalCalories} kcal</p>
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
        </div>
    );
}

export default AnalysisComponent;
