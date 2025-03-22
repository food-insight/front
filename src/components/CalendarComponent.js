import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { getCookie } from "../util/cookieUtil";


function CalendarComponent() {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);

    const token = getCookie("accessToken").replace("Bearer ", "");

    // 저장된 식사 데이터 불러오기
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/meals/", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                });

                const mealEvents = response.data.meals.map(meal => {
                    // meal.foods에서 음식 이름을 모아서 하나의 문자열로 합침
                    const foodNames = meal.foods.map(food => food.food_name).join(", ");

                    // 이벤트 객체 생성
                    return {
                        title: `${foodNames} (${meal.meal_time})`, // 제목에 음식 이름과 식사 시간 추가
                        start: meal.date, // 시작 날짜 설정
                        end: meal.date, // 같은 날짜에만 표시되도록 설정
                        extendedProps: {
                            mealTime: meal.meal_time,
                            content: meal.content
                        }
                    };
                });

                setEvents(mealEvents);
            } catch (error) {
                console.error("식사 데이터 불러오기 실패:", error);
            }
        };

        fetchEvents();
    }, [token]); // 토큰이 변경될 때마다 다시 요청

    useEffect(() => {
        const calendar = new Calendar(calendarRef.current, {
            plugins: [dayGridPlugin, listPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            events: events,
            selectable: false, // 이벤트 추가 기능을 비활성화
            eventClick: (info) => {
                // 이벤트 클릭 시 상세 정보 보여주기 (선택적으로 추가 가능)
                alert(`식사 시간: ${info.event.extendedProps.mealTime}\n내용: ${info.event.extendedProps.content}`);
            }
        });

        calendar.render();
    }, [events]);

    return (
        <div className="bg-white p-4 shadow-lg rounded-lg">
            <div ref={calendarRef} className="w-full"></div>
        </div>
    );
}

export default CalendarComponent;
