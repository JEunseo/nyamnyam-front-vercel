"use client";
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventContentArg } from "@fullcalendar/core";
import { Dropdown } from "react-bootstrap";
import { ReceiptModel } from "src/app/model/receipt.model";
import { fetchReceiptWallet } from "@/app/service/receipt/receipt.service";
import nookies from "nookies";

interface Todo {
    todo: string[];
}

interface CalendarEvent {
    title: string;
    date: string;
    color?: string;
    extendedProps?: Todo;
}

const MyCalendar: React.FC = () => {
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [wallet, setWallet] = useState<ReceiptModel[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
    const cookies = nookies.get();
    const id = cookies.userId;

    const handleToggle = (eventId: string) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [eventId]: !prevState[eventId]
        }));
    };

    useEffect(() => {
        const loadWalletData = async () => {
            try {
                const updatedData = await fetchReceiptWallet(id);
                setWallet(updatedData);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        loadWalletData();
    }, [id]);

    useEffect(() => {
        const walletEvents: CalendarEvent[] = wallet.map((item) => {
            const eventDate = new Date(item.date);
            const isoDate = eventDate.toISOString().split('T')[0];
            return {
                title: item.name,
                date: isoDate,
                color: '#43aaad',
                extendedProps: {
                    todo: [`지출: ${item.price}`]
                }
            };
        });

        setFilteredEvents([...walletEvents]);
    }, [wallet]);

    const renderEventContent = (eventInfo: EventContentArg) => {
        const todos = eventInfo.event.extendedProps?.todo || [];
        const eventId = eventInfo.event.title;

        return (
            <Dropdown show={openDropdowns[eventId]} onToggle={() => handleToggle(eventId)}>
                <Dropdown.Toggle onClick={() => handleToggle(eventId)}>
                    <span style={{ fontSize: '0.8rem' }}>{eventInfo.event.title}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {openDropdowns[eventId] && todos.map((todoItem: string, index: number) => (
                        <Dropdown.Item key={index}>{todoItem}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={filteredEvents}
                eventContent={renderEventContent}
                editable={true}
                droppable={true}
                fixedWeekCount={false}
            />
        </div>
    );
};

export default MyCalendar;
