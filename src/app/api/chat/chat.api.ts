// /src/app/api/chat/chat.api.ts
import EventSourcePolyfill from 'event-source-polyfill';

let token: string | null = null;

if (typeof window !== "undefined") {
    // 브라우저 환경에서만 localStorage 접근
    token = localStorage.getItem('token');
}
// 채팅 메시지 스트리밍 API
export const subscribeToChats = (chatRoomId: any, onMessageReceived: (arg0: any) => void) => {
  const eventSource = new EventSourcePolyfill(`https://abc.nyamnyam.kr/api/chats/${chatRoomId}`, {
    method: "GET",
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
    withCredentials: true,
  });


  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessageReceived(data);
  };

  eventSource.onerror = (event) => {
    console.error("EventSource 에러:", event);
    eventSource.close(); // 에러 발생 시 EventSource 종료
  };

  return () => {
    eventSource.close(); // 메모리 누수를 방지하기 위해 EventSource 종료
  };
};


export const sendChat = async (chatRoomId: any, chat: any) => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chats/${chatRoomId}`, {
    method: "POST",
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
    body: JSON.stringify(chat),
  });

  if (!response.ok) {
    const errorResponse = await response.json(); // 오류 응답을 JSON으로 파싱
    throw new Error(`메시지 전송 실패: ${errorResponse.message || "알 수 없는 오류"}`);
  }

  return response.json(); // 필요하면 응답 데이터를 반환
};

// 읽었는지 안읽었는지 확인하기위해 추가

// 채팅방의 읽지 않은 메시지 수를 조회하는 API
export const getUnreadCount = async (chatRoomId: string, nickname: string): Promise<number> => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chats/${chatRoomId}/unreadCount/${nickname}`, {
    method: "GET",
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`읽지 않은 메시지 수 조회 실패: ${errorResponse.message || "알 수 없는 오류"}`);
  }

  return response.json(); // 읽지 않은 메시지 수를 반환
};

// 특정 메시지에서 읽지 않은 참가자 수를 조회하는 API
export const getNotReadParticipantsCount = async (chatId: string): Promise<number> => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chats/${chatId}/notReadParticipantsCount`, {
    method: "GET",
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`읽지 않은 참가자 수 조회 실패: ${errorResponse.message || "알 수 없는 오류"}`);
  }

  return response.json(); // 읽지 않은 참가자 수를 반환
};

// 메시지를 읽음으로 표시하는 API
export const markMessageAsRead = async (chatId: string, nickname: string): Promise<any> => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chats/${chatId}/read/${nickname}`, {
    method: 'PATCH',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`메시지 읽음 처리 실패: ${errorResponse.message || "알 수 없는 오류"}`);
  }

  return response.json(); // 읽음 처리된 메시지를 반환
};


// 메시지를 읽음으로 표시하는 새로운 API (PUT 메서드 추가)
export const updateReadBy = async (chatId: string, nickname: string): Promise<any> => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chats/${chatId}/read/${nickname}`, {
    method: 'PUT', // 새로 추가된 PUT 메서드
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`메시지 읽음 처리 실패: ${errorResponse.message || "알 수 없는 오류"}`);
  }

  return response.json(); // 읽음 처리된 메시지를 반환
};