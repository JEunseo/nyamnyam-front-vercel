"use client";
import React, { useEffect } from "react";
import { Calendar as FullCalendar } from "@fullcalendar/react"; // FullCalendar 라이브러리의 React 래퍼를 사용

const CalendarComponent = ({ events }) => {
    useEffect(() => {
        // 이곳에서 캘린더 초기화 또는 이벤트 처리
    }, []);

    return (
        <FullCalendar
            plugins={[]}
            initialView="dayGridMonth"
            events={events}
            editable={true}
            droppable={true}
        />
    );
};

export default CalendarComponent;