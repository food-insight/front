import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function CalendarComponent() {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);

    // 저장된 식사 데이터 불러오기
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("/api/meals"); // 식사 데이터 API 호출
                const mealEvents = response.data.map(meal => ({
                    title: meal.food_names.join(", "), // 여러 음식 이름을 하나의 문자열로 합침
                    start: meal.date, // meal.date를 사용하여 시작 날짜 설정
                    end: meal.date, // 같은 날에만 표시
                }));
                setEvents(mealEvents);
            } catch (error) {
                console.error("식사 데이터 불러오기 실패:", error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const calendar = new Calendar(calendarRef.current, {
            plugins: [dayGridPlugin, listPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            events: events,
            selectable: false, // 이벤트 추가 기능을 비활성화
        });

        calendar.render();
    }, [events]);

    return (
        <div>
            <div ref={calendarRef}></div>
        </div>
    );
}

export default CalendarComponent;
