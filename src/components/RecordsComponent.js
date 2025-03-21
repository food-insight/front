import React, { useState, useEffect, useRef } from "react";
import { FaCamera, FaMicrophone } from "react-icons/fa";
import { recordMeal, fetchMeals, deleteMeal } from "../api/mealApi";
import { uploadImage, recognizeFood } from "../api/imageApi";
import { recognizeSpeech } from "../api/speechApi";
import ModalComponent from "./ModalComponent";

function RecordsComponent(props) {
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [mealType, setMealType] = useState("아침");
    const [calories, setCalories] = useState("0");
    const [description, setDescription] = useState("");
    const [foodNames, setFoodNames] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [meals, setMeals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const scriptProcessorRef = useRef(null);
    const audioBufferRef = useRef([]);

    useEffect(() => {
        loadMeals();
    }, []);

    const loadMeals = async () => {
        try {
            const data = await fetchMeals();
            setMeals(data.meals);
        } catch (error) {
            console.error("Failed to load meals:", error);
        }
    };

    const handleDateChange = (e) => setDate(e.target.value);
    const handleMealChange = (e) => setMealType(e.target.value);
    const handleCaloriesChange = (e) => setCalories(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleFoodNamesChange = (e) => setFoodNames(e.target.value.split(',').map(item => item.trim()));
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        recognizeFoodFromImage(file); // Call the function to recognize food
    };

    const handleClearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        document.getElementById('imageInput').value = null;
    };

    const handleSubmit = async () => {
        const mealData = {
            meal_time: mealType,
            content: description,
            date: date,
            calories: calories,
            food_names: foodNames
        };

        try {
            const mealResponse = await recordMeal(mealData);
            alert("식사 기록이 저장되었습니다.");

            if (imageFile && mealResponse.meal_id) {
                await uploadImage(imageFile, mealResponse.meal_id);
                alert("이미지 업로드가 성공적으로 완료되었습니다.");
            }

            loadMeals(); // Reload meals after adding
        } catch (error) {
            alert("식사 기록 저장 또는 이미지 업로드에 실패했습니다.");
        }
    };

    const handleTitleClick = (meal) => {
        setSelectedMeal(meal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMeal(null);
    };

    const handleCheckboxChange = (mealId) => {
        setSelectedMeals(prevSelectedMeals =>
            prevSelectedMeals.includes(mealId)
                ? prevSelectedMeals.filter(id => id !== mealId)
                : [...prevSelectedMeals, mealId]
        );
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedMeals.map(mealId => deleteMeal(mealId)));
            setSelectedMeals([]);
            alert("선택한 식사가 삭제되었습니다.");
            loadMeals(); // Reload meals after deleting
        } catch (error) {
            alert("식사 삭제에 실패했습니다.");
        }
    };

    const recognizeFoodFromImage = async (file) => {
        try {
            const response = await recognizeFood(file);
            const recognizedFoods = response.data.recognized_foods;
            if (recognizedFoods.length > 0) {
                const foodNames = recognizedFoods.map(food => food.name);
                const description = recognizedFoods.map(food => food.details.description).join(', ');
                const calories = recognizedFoods.map(food => food.details.calories).reduce((acc, cur) => acc + cur, 0);
                setFoodNames(foodNames);
                setDescription(description);
                setCalories(calories);
            }
        } catch (error) {
            console.error("Failed to recognize food:", error);
        }
    };
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = async () => {
        setIsRecording(true);
        audioBufferRef.current = [];

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        mediaStreamRef.current = audioContextRef.current.createMediaStreamSource(stream);
        scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        scriptProcessorRef.current.onaudioprocess = (event) => {
            const audioData = event.inputBuffer.getChannelData(0);
            audioBufferRef.current.push(new Float32Array(audioData));
        };

        mediaStreamRef.current.connect(scriptProcessorRef.current);
        scriptProcessorRef.current.connect(audioContextRef.current.destination);
    };

    const stopRecording = () => {
        setIsRecording(false);
        scriptProcessorRef.current.disconnect();
        mediaStreamRef.current.disconnect();

        const audioBlob = exportWAV(audioBufferRef.current);
        const audioFile = new File([audioBlob], "recording.wav", { type: 'audio/wav' });
        sendAudioToServer(audioFile);
    };

    const exportWAV = (audioBuffer) => {
        const bufferLength = audioBuffer.reduce((acc, cur) => acc + cur.length, 0);
        const result = new Float32Array(bufferLength);
        let offset = 0;
        for (let i = 0; i < audioBuffer.length; i++) {
            result.set(audioBuffer[i], offset);
            offset += audioBuffer[i].length;
        }

        const wavBuffer = encodeWAV(result, audioContextRef.current.sampleRate);
        return new Blob([wavBuffer], { type: 'audio/wav' });
    };

    const encodeWAV = (samples, sampleRate) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        let offset = 44;
        for (let i = 0; i < samples.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }

        return view;
    };

    const sendAudioToServer = async (audioFile) => {
        try {
            const response = await recognizeSpeech(audioFile);
            if (response.success) {
                const { meal_info, message, transcript } = response.data;
                setMealType(meal_info.mealtime);
                setFoodNames(meal_info.foods);
                setDescription(transcript);
                alert(message);
            } else {
                alert("음성 인식에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("오디오 전송 실패:", error);
            alert("음성 인식에 실패했습니다. 오디오 파일 형식을 확인해주세요.");
        }
    };

    return (
        <div className="relative w-full h-auto bg-white rounded-[10px] shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">식단 기록</h2>
           <div className="flex flex-row items-center justify-center mb-4">
                <div className="flex flex-col items-center mr-4">
                    <div className="w-32 h-32 rounded-full border border-gray-300 flex items-center justify-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <FaCamera className="text-4xl text-gray-500 cursor-pointer" onClick={() => document.getElementById('imageInput').click()} />
                        )}
                        <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                    </div>
                    {imagePreview && (
                        <button onClick={handleClearImage} className="text-red-500">삭제</button>
                    )}
                    <p className="text-sm text-gray-600 mt-2">이미지 업로드</p>
                </div>
                <div className="flex flex-col items-center ml-4">
                    <div className="w-32 h-32 rounded-full border border-gray-300 flex items-center justify-center">
                        <FaMicrophone className={`text-4xl ${isRecording ? 'text-red-500' : 'text-gray-500'} cursor-pointer`} onClick={toggleRecording} />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">음성으로 입력하기</p>
                </div>
            </div>
            <div className="mb-4 flex items-center justify-center space-x-4">
                <label className="block text-m font-semibold text-gray-700">날짜 선택</label>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="mt-1 p-2 border rounded"
                />
                <label className="block text-m font-semibold text-gray-700">식사 유형</label>
                <select
                    value={mealType}
                    onChange={handleMealChange}
                    className="mt-1 p-2 border rounded"
                >
                    <option>아침</option>
                    <option>점심</option>
                    <option>저녁</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-m font-semibold text-gray-700">칼로리</label>
                <input
                    type="number"
                    value={calories}
                    onChange={handleCaloriesChange}
                    className="mt-1 w-2/5 p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-m font-semibold text-gray-700">설명</label>
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    className="mt-1 w-2/5 p-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-m font-semibold text-gray-700">음식 이름들 (쉼표로 구분)</label>
                <input
                    type="text"
                    value={foodNames.join(', ')}
                    onChange={handleFoodNamesChange}
                    className="mt-1 w-2/5 p-2 border rounded"
                />
            </div>
            <h3 className="text-lg font-semibold mb-2">기록된 음식</h3>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b"></th>
                    <th className="py-2 px-4 border-b">Title</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Meal</th>
                    <th className="py-2 px-4 border-b">Menu</th>
                </tr>
                </thead>
                <tbody>
                {meals.map((meal) => (
                    <tr key={meal.mid} className="text-center">
                        <td className="py-2 px-4 border-b">
                            <input
                                type="checkbox"
                                checked={selectedMeals.includes(meal.mid)}
                                onChange={() => handleCheckboxChange(meal.mid)}
                            />
                        </td>
                        <td className="py-2 px-4 border-b cursor-pointer" onClick={() => handleTitleClick(meal)}>{meal.content}</td>
                        <td className="py-2 px-4 border-b">{meal.date}</td>
                        <td className="py-2 px-4 border-b">{meal.meal_time}</td>
                        <td className="py-2 px-4 border-b">{meal.foods.map(food => food.food_name).join(', ')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex content-center justify-center space-x-4 mt-4">
                <button onClick={handleDeleteSelected} className="border border-solid border-[#605bff1a] text-[#605bff] px-32 py-2 rounded-xl">삭제</button>
                <button onClick={handleSubmit} className="bg-[#605bff] text-white px-32 py-2 rounded-xl">저장</button>
            </div>

            {isModalOpen && selectedMeal && (
                <ModalComponent meal={selectedMeal} onClose={handleCloseModal} onUpdate={loadMeals} />
            )}
        </div>
    );
}

export default RecordsComponent;