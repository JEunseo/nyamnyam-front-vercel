import { useState, useEffect, useRef } from "react";
import { deleteChatRoomApi } from "../api/chatRoom/chatRoom.api";

interface ChatRoomProps {
    chatRoomId: string;
    nickname: string;
}

export const ChatRooms: React.FC<ChatRoomProps> = ({ chatRoomId, nickname }) => {
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const openDropdown = () => setDropdown(true);
    const closeDropdown = () => setDropdown(false);

    const handleLeaveChatRoom = async () => {
        try {
            await deleteChatRoomApi(chatRoomId, nickname);
            console.log("채팅방 나가기 성공");
        } catch (error) {
            console.error("채팅방 나가기 실패", error);
        } finally {
            closeDropdown();
        }
    };

    // 외부 클릭 감지하여 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown]);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button 
                className="flex items-center justify-center p-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition duration-200" 
                onClick={openDropdown}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 256 256"
                >
                    <path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path>
                </svg>
            </button>

            {dropdown && (
                <div className="dropdown-menu absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <button 
                        className="dropdown-item block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition duration-200" 
                        style={{ whiteSpace: 'nowrap'}} 
                        onClick={handleLeaveChatRoom}
                    >
                        채팅방 나가기
                    </button>
                </div>
            )}
        </div>
    );
};
