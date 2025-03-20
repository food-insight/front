import React, { useEffect, useState } from "react";
import { fetchImage } from "../api/imageApi";
import { updateMeal } from "../api/mealApi";

const ModalComponent = ({ meal, onClose, onUpdate }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [mealTime, setMealTime] = useState(meal.meal_time);
    const [content, setContent] = useState(meal.content);
    const [foods, setFoods] = useState(meal.foods.map(food => food.food_name).join(', '));

    useEffect(() => {
        const loadImage = async () => {
            if (meal.has_image) {
                try {
                    const imageData = await fetchImage(meal.image_path);
                    setImageUrl(imageData);
                } catch (error) {
                    console.error("Failed to fetch image:", error);
                }
            }
        };

        loadImage();
    }, [meal]);

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSave = async () => {
        const updatedMeal = {
            meal_time: mealTime,
            content: content,
            foods: foods.split(',').map(food => food.trim())
        };

        try {
            await updateMeal(meal.mid, updatedMeal);
            alert("식사 정보가 수정되었습니다.");
            setIsEditMode(false);
            onUpdate(); // Call the update function to reload meals
        } catch (error) {
            alert("식사 정보 수정에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl h-auto w-3/4 space-y-6">
                <h2 className="text-3xl font-semibold text-gray-800">식사 상세 정보</h2>
                <div className="text-lg text-gray-700 space-y-2">
                    {isEditMode ? (
                        <>
                            <div>
                                <label className="font-medium">식사 유형:</label>
                                <select
                                    value={mealTime}
                                    onChange={(e) => setMealTime(e.target.value)}
                                    className="ml-2 p-1 border rounded"
                                >
                                    <option value="아침">아침</option>
                                    <option value="점심">점심</option>
                                    <option value="저녁">저녁</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-medium">내용:</label>
                                <input
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="ml-2 p-1 border rounded"
                                />
                            </div>
                            <div>
                                <label className="font-medium">음식:</label>
                                <input
                                    type="text"
                                    value={foods}
                                    onChange={(e) => setFoods(e.target.value)}
                                    className="ml-2 p-1 border rounded"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong className="font-medium">식사 유형:</strong> {mealTime}</p>
                            <p><strong className="font-medium">내용:</strong> {content}</p>
                            <p><strong className="font-medium">음식:</strong> {meal.foods.map(food => food.food_name).join(', ')}</p>
                        </>
                    )}
                </div>
                {imageUrl && (
                    <div className="flex justify-center">
                        <div className="max-w-full max-h-96 overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Meal"
                                className="rounded-lg shadow-lg object-contain w-full h-full"
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-center space-x-4">
                    {isEditMode ? (
                        <>
                            <button
                                onClick={handleEditToggle}
                                className="mt-4 bg-gray-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-500 transition duration-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="mt-4 bg-green-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-500 transition duration-200"
                            >
                                저장
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEditToggle}
                                className="mt-4 bg-blue-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition duration-200"
                            >
                                수정
                            </button>
                            <button
                                onClick={onClose}
                                className="mt-4 bg-red-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-500 transition duration-200"
                            >
                                닫기
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;