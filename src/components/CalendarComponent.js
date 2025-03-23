import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Dialog, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { getCookie } from "../util/cookieUtil";

function CalendarComponent() {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [events, setEvents] = useState([]);

    const token = getCookie("accessToken").replace("Bearer ", "");

    useEffect(() => {
        fetchMealsAndSetEvents();
    }, []);

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
        setSelectedDate(arg.dateStr);
        setOpenDialog(true);
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
        return date === today ? "today-number-highlight" : "";
    };

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
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

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <div className="dialog-content" style={{ padding: "20px" }}>
                    <h2>사용자 이벤트 추가</h2>
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

            <style>
                {`
                    .calendar-wrapper {
                        width: 100%;
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 0 1rem;
                        box-sizing: border-box;
                        overflow-x: auto;
                    }

                    /* 헤더 스타일 조정 */
                    .fc-toolbar-title {
                        font-size: 1.5rem;
                        display: flex;
                        gap: 0.25em;
                    }

                    .fc-toolbar-title::first-letter {
                        font-weight: bold;
                    }

                    @media (max-width: 768px) {
                        .fc-toolbar-title {
                            font-size: 1.25rem;
                        }

                        .calendar-wrapper {
                            padding-left: 0.5rem;
                            padding-right: 0.5rem;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default CalendarComponent;