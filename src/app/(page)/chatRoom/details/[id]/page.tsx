"use client";

import { useEffect, useState } from "react";

interface Chat {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
}

interface ChatRoomModel {
  id: string; // 채널 ID
  name: string; // 채널 이름
  participants?: Participant[]; // 참가자 목록
}

interface Participant {
  id: string;
  nickname?: string; // 선택적 닉네임
}

export default function ChatRoom({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState(""); // 사용자 ID
  const [chatRoom, setChatRoom] = useState<ChatRoomModel | null>(null); // 채팅방 정보

  const chatRoomId = params.id;

  useEffect(() => {
    // 채팅방 정보 및 참가자 목록 가져오기
    fetch(`http://localhost:8080/api/chatRoom/${chatRoomId}`)
      .then(response => response.json())
      .then((data: ChatRoomModel) => {
        setChatRoom(data);
      })
      .catch(error => console.error("채팅방 정보를 가져오는 중 오류 발생:", error));

    const eventSource = new EventSource(`http://localhost:8080/api/chats/${chatRoomId}`);

    eventSource.onmessage = (event) => {
      const data: Chat = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    return () => {
      eventSource.close(); // 컴포넌트 언마운트 시 EventSource 닫기
    };
  }, [chatRoomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === "" || sender.trim() === "") {
      alert("메시지와 사용자 이름을 입력해주세요.");
      return;
    }

    const chat = {
      sender: sender,
      message: newMessage,
      chatRoomId: chatRoomId,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/chats/${chatRoomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chat),
      });

      if (!response.ok) {
        throw new Error("메시지 전송 실패");
      }

      setNewMessage(""); // 메시지 입력 필드 초기화
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);               

    try {
      const response = await fetch(`http://localhost:8080/api/chats/${chatRoomId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const imageUrl = await response.text();
      setNewMessage((prevMessage) => prevMessage + ` ${imageUrl}`);
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    }
  };


  return (
    <div className="chat-room flex h-screen p-4 bg-gray-100">
      {/* 왼쪽 사이드바에 참가자 목록 추가 */}
      <div className="participants w-1/4 bg-white p-4 shadow-md rounded-lg overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">참가자 목록</h2>
        <ul className="space-y-2">
          {chatRoom?.participants && chatRoom.participants.length > 0 ? (
            chatRoom.participants.map((participant) => (
              <li key={participant.id} className="p-2 bg-gray-200 rounded-lg">
                {participant.nickname || "닉네임 없음"}
              </li>
            ))
          ) : (
            <li className="p-2 bg-gray-200 rounded-lg">참가자가 없습니다.</li>
          )}
        </ul>
      </div>

      {/* 채팅방 메시지와 입력창 */}
      <div className="messages-container flex flex-col w-3/4 ml-4">
        <h1 className="text-2xl font-bold text-center mb-4">채팅방 - {chatRoom?.name}</h1>

        <div className="messages flex-1 overflow-y-auto p-4 bg-white shadow-md rounded-lg space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === sender ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3 rounded-lg shadow-md ${msg.sender === sender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'} max-w-xs`}>
                <p className="font-semibold">{msg.sender === sender ? "You" : msg.sender}</p>
                <p>{msg.message}</p>
                <small className="block text-xs mt-2">{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="message-form flex mt-4">
          <input
            type="text"
            placeholder="Your name"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="input flex-grow border border-gray-300 p-2 rounded-l-lg"
            required
          />
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input flex-grow border border-gray-300 p-2"
            required
          />
          <input
            type="file"
            onChange={(e) => handleFileUpload(e)}
            className="input border border-gray-300 p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-lg"
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
