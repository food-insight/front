import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Dialog, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { getCookie } from "../util/cookieUtil";
import interactionPlugin from '@fullcalendar/interaction';

function CalendarComponent() {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [events, setEvents] = useState([]);
    const token = getCookie("accessToken")?.replace("Bearer ", ""); // 토큰 가져오기

    useEffect(() => {
        if (token) {
            fetchMealsAndSetEvents();
        }
    }, [token]);

    useEffect(() => {
        console.log("openDialog 상태:", openDialog);
    }, [openDialog]);


    const fetchMealsAndSetEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/meals", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const mealEvents = (response.data.meals || []).map((meal) => {
                const foodText = meal.foods.map(f => f.food_name).join(", ");
                let backgroundColor = "#ccc";
                if (meal.meal_time === "아침") backgroundColor = "#FFC7E0CC";
                if (meal.meal_time === "점심") backgroundColor = "#CBEFFFCC";
                if (meal.meal_time === "저녁") backgroundColor = "#D8CDFFCC";

                return {
                    title: `${meal.meal_time} : ${foodText}`,
                    start: meal.date,
                    allDay: true,
                    id: `meal-${meal.mid}`,
                    backgroundColor,
                    borderColor: backgroundColor,
                    textColor: "#00080A",
                };
            });

            setEvents(mealEvents);
        } catch (error) {
            console.error("식사 데이터를 불러오는 데 실패했습니다:", error);
        }
    };

    const handleDateClick = (arg) => {
        console.log("날짜 클릭됨:", arg.dateStr); // 확인용 로그
        setSelectedDate(arg.dateStr);
        setOpenDialog(true);
        console.log("openDialog 상태 변경 요청: true");
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEventTitle("");
    };

    const handleEventSave = () => {
        if (eventTitle.trim() === "") return;

        const newEvent = {
            title: eventTitle,
            start: selectedDate,
            allDay: true,
            id: `custom-${Date.now()}`,
            textColor: "#504E4E",
        };

        setEvents((prev) => [...prev, newEvent]);
        handleDialogClose();
    };

    const highlightToday = (date) => {
        const today = dayjs().format("YYYY-MM-DD");
        return date === today ? "bg-secondary text-black font-bold" : "";
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 overflow-x-auto">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                dateClick={(arg) => {
                    console.log("📌 dateClick 이벤트 실행됨!", arg);
                    handleDateClick(arg);
                }}
                selectable={true} // ✅ 클릭 허용
                events={events}
                dayCellClassNames={(arg) => highlightToday(arg.dateStr)}
                height="auto"
                contentHeight="auto"
                aspectRatio={1.35}
                headerToolbar={{
                    start: "title",
                    center: "",
                    end: "prev,next"
                }}
                eventDidMount={(info) => {
                    info.el.setAttribute("title", info.event.title);
                }}
            />

            {/* 다이얼로그 모달 */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <div className="p-5">
                    <h2 className="text-lg font-semibold mb-3">사용자 이벤트 추가</h2>
                    <TextField
                        label="이벤트 제목"
                        variant="outlined"
                        fullWidth
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </div>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        취소
                    </Button>
                    <Button onClick={handleEventSave} color="primary">
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CalendarComponent;
