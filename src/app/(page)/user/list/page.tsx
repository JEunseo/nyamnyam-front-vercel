"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

interface User {
    id: number;
    nickname: string;
}

interface ChatRoom {
    id: string;
    name: string;
}

interface Participant {
    id: string;
    name: string;
}

const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch('http://localhost:8080/api/user/findAll');
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return await res.json();
};

const createChatRoom = async (participantId: number): Promise<void> => {
    // 새로운 채팅방을 생성합니다.
    const chatRoomData = { /* 채팅방 데이터 설정 */ };

    const res = await fetch('http://localhost:8080/api/chatRoom/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRoomData),
    });

    if (!res.ok) {
        throw new Error('Failed to create chat room');
    }

    // 참가자를 채팅방에 추가합니다.
    const chatRoom = await res.json();
    const participantData = { chatRoomId: chatRoom.id, userId: participantId };

    const participantRes = await fetch('http://localhost:8080/api/participants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData),
    });

    if (!participantRes.ok) {
        throw new Error('Failed to add participant');
    }
};

const UserList = () => {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const userData = await fetchUsers();
                setUsers(userData);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        getUsers();
    }, []);

    const filteredUsers = currentUser ? users.filter(user => user.id !== currentUser.id) : users;

    const handleUserClick = async (userId: number) => {
        try {
            const chatRoom = await createChatRoom(userId); // 채팅방 생성 후 반환된 정보를 저장
            alert('Chat room created and user added successfully!');
            
            router.push('/chatRoom/details/${id}');
            
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                setError(error.message);
            } else {
                console.error('An unknown error occurred');
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        <button onClick={() => handleUserClick(user.id)} className="text-blue-500 underline">
                            {user.nickname}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
