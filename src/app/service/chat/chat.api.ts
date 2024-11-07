// /src/app/service/chat/chat.api.ts
import { sendChat, subscribeToChats } from "src/app/api/chat/chat.api";

// 채팅 메시지 스트리밍 서비스 함수
export const subscribeMessages = (chatRoomId: any, onMessageReceived: (arg0: any) => void) => {
  try {
     
    return subscribeToChats(chatRoomId, onMessageReceived); // 구독 해제 함수를 반환
  } catch (error) {
    console.error("메시지 구독 중 오류 발생:", error);
    throw error;
  }
};

// 메시지 전송 서비스 함수
export const sendMessageService = async (chatRoomId: any, messageData: any) => {
  if (messageData.message.trim() === "" || messageData.sender.trim() === "") {
    alert("메시지와 사용자 이름을 입력해주세요.");
    return;
  }

  const chat = {
    sender: messageData.sender,
    message: messageData.message,
    chatRoomId: chatRoomId,
    readBy: messageData.readBy
  };

  try {
    const sentMessage = await sendChat(chatRoomId, chat); // API 호출 및 반환된 메시지를 저장
    return sentMessage; // 서버에서 반환된 메시지 객체를 반환
  } catch (error) {
    console.error("메시지 전송 중 오류 발생:", error);
    throw error;
  }
};