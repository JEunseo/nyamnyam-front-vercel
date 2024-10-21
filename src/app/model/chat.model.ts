export interface ChatModel {
    id: string;
  sender: string;
  message: string;
  createdAt: string;
  chatRoomId?: string;
   // 참가자 읽음 상태 (참가자 수에 따라 크기가 달라질 수 있음)
   readBy: { [key: string]: boolean }; // key: 참가자 닉네임, value: 읽음 여부
   // 추가: 총 참가자 수 (읽지 않은 메시지 수를 계산할 때 필요)
   totalParticipants: number;
    
}

