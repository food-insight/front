import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Dialog, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

function CalendarComponent() {
    const calendarRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const calendar = new Calendar(calendarRef.current, {
            plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
            initialView: "dayGridMonth", // 초기 뷰 설정
            events: events, // 캘린더에 표시할 이벤트
            dateClick: (info) => handleDateClick(info), // 날짜 클릭 시 이벤트 처리
        });

        calendar.render();
    }, [events]);

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        setOpenDialog(true); // 다이얼로그 열기
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEventTitle(""); // 다이얼로그 닫을 때 제목 초기화
    };

    const handleEventSave = async () => {
        if (eventTitle.trim() === "") return;

        // 새로운 이벤트 저장
        const newEvent = {
            title: eventTitle,
            start: selectedDate,
            end: selectedDate,
        };

        // 이벤트 추가 API 호출 (예시: axios를 사용해 백엔드로 데이터 전송)
        try {
            await axios.post("/api/events", newEvent); // 실제 API URL로 변경 필요
            setEvents([...events, newEvent]); // 캘린더에 새 이벤트 추가
            handleDialogClose();
        } catch (error) {
            console.error("이벤트 저장 실패:", error);
        }
    };

    return (
        <div>
            <div ref={calendarRef}></div>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <div className="dialog-content" style={{ padding: "20px" }}>
                    <h2>새 이벤트 추가</h2>
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
