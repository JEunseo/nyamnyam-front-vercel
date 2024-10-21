import { useState } from "react";
import { PostOptionsProps } from "../model/props";

const PostOptions: React.FC<PostOptionsProps> = ({postUserId, currentId, onEdit, onDelete, onReport}) =>{
    const [dropdown, setDropdown] = useState(false);
    
    const openDropdown = () => {
        setDropdown(!dropdown); 
    }; 

    const closeDropdown = () => {
        setDropdown(false);
    }; 

    return(
        <div className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
        >
            <button className="more-options-button" 
            onClick={() => {
                openDropdown();
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"></path>
                </svg>
            </button>

            {dropdown &&  (
                <div className="dropdown-menu absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {postUserId === currentId ? (
                        <>
                        <button 
                            className="dropdown-item block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition duration-200"
                            onClick={() => { onEdit(); closeDropdown(); }}
                            style={{ whiteSpace: 'nowrap' }} >수정 </button>
                        <button className="dropdown-item block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition duration-200" 
                        style={{ whiteSpace: 'nowrap'}} 
                        onClick={() => { onDelete(); closeDropdown(); }}>삭제</button>
                        </>
                    ):(
                        <button className="dropdown-item block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition duration-200" 
                        style={{ whiteSpace: 'nowrap'}} 
                        onClick={() => { onReport(); closeDropdown(); }}>신고하기</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostOptions;