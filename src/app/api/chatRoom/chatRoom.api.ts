import { ChatRoomModel } from "@/app/model/chatRoom.model";

// /src/app/api/chatRoom/chatRoom.api.ts
let token: string | null = null;

if (typeof window !== "undefined") {
    // 브라우저 환경에서만 localStorage 접근
    token = localStorage.getItem('token');
}

export async function insertChatRoom(chatRoom: ChatRoomModel): Promise<any | { status: number; data?: any; message?: string }> {
  try {
    const response = await fetch('https://abc.nyamnyam.kr/api/chatRoom/save', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        "Content-Type": "application/json",
    },
      body: JSON.stringify(chatRoom)
    });

    // 응답이 성공적일 경우 JSON 형태의 응답 데이터와 상태 코드 반환
    const responseData = await response.json();
    return { status: response.status, data: responseData };

  } catch (e) {
    console.error('Fetch operation failed:', e);
    return { status: 500, message: 'Network error or server unavailable' };
  }
}

export async function checkChatRoom(chatRoom: ChatRoomModel): Promise<any | { status: number; data?: any; message?: string }> {
  try {
    const response = await fetch('https://abc.nyamnyam.kr/api/chatRoom/check', {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        "Content-Type": "application/json",
    },
      body: JSON.stringify(chatRoom)
    });

    // 응답 상태가 성공적인지 확인
    if (!response.ok) {
      // 서버에서 에러 메시지를 제공하는 경우
      const errorResponse = await response.text(); // 혹은 response.json()을 시도할 수도 있습니다.
      return { status: response.status, message: errorResponse || 'Unexpected error occurred' };
    }

    // 성공적인 경우 JSON 형태의 응답 데이터와 상태 코드 반환
    const responseData = await response.json();
    return { status: response.status, data: responseData };

  } catch (e) {
    console.error('Fetch operation failed:', e);
    return { status: 500, message: 'Network error or server unavailable' };
  }
}



// 챗룸 출력(해당 유저가 참여한으로 수정 필요)
export const fetchChatRooms = async (nickname: any) => {
  console.log(token)
  const response = await fetch(`https://abc.nyamnyam.kr/api/chatRoom/findAll/${nickname}`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
    mode: 'cors', // CORS 요청 모드 설정
    credentials: 'include', // 쿠키나 인증 정보 포함 여부 설정
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // ChatRooms 데이터 반환
};

// 챗룸 갯수 세는건데 나중에 페이지 할까봐
export const fetchChatRoomCount = async () => {

  const response = await fetch('https://abc.nyamnyam.kr/api/chatRoom/count', {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // 채팅방 총 개수 반환
};

export const fetchChatRoomById = async (chatRoomId: any) => {

  const response = await fetch(`https://abc.nyamnyam.kr/api/chatRoom/${chatRoomId}`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });
  if (!response.ok) {
    throw new Error("채팅방 정보를 가져오는 중 오류 발생");
  }
  return response.json();
};


// api/chatRoomApi.ts
export const deleteChatRoomApi = async (chatRoomId: string, nickname: string) => {
  const response = await fetch(`https://abc.nyamnyam.kr/api/chatRoom/leaveChatRoom/${chatRoomId}/${nickname}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("채팅방 나가기 실패");
  }

  return await response.json();
};