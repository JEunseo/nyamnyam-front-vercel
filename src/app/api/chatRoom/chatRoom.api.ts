// /src/app/api/chatRoom/chatRoom.api.ts
let token: string | null = null;

if (typeof window !== "undefined") {
    // 브라우저 환경에서만 localStorage 접근
    token = localStorage.getItem('token');
}

// 챗룸 출력(해당 유저가 참여한으로 수정 필요)
export const fetchChatRooms = async (nickname: any) => {
  
  const response = await fetch(`http://localhost:8080/api/chatRoom/findAll/${nickname}`, {
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

  const response = await fetch('http://localhost:8080/api/chatRoom/count', {
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

  const response = await fetch(`http://localhost:8080/api/chatRoom/${chatRoomId}`, {
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
export const deleteChatRoomApi = async (chatRoomId: string) => {

  const response = await fetch(`http://localhost:8080/api/chatRoom/deleteById/${chatRoomId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      "Content-Type": "application/json",
  },
  });
  if (!response.ok) {
    throw new Error("채팅방 삭제 실패");
  }
};