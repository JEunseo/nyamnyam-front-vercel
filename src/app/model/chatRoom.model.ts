import { ChatModel } from "./chat.model";

export interface ChatRoomModel {
    id: string; // Channel ID (optional for update, auto-generated for new records)
    name: string; // Channel name
    participants: string[]; // List of participant IDs


    unreadCount: number; 
    notReadParticipantsCount: number;
}

