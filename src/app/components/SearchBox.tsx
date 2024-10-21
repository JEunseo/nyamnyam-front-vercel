import React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter: () => void; // 엔터 이벤트 추가
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch, onEnter }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onEnter(); // 엔터 키가 눌렸을 때 onEnter 호출
        }
    };

    return (
        <input
            type="text"
            placeholder="Search by name, address, type, or menu..."
            value={searchTerm}
            onChange={onSearch}
            onKeyDown={handleKeyDown} // 이벤트 핸들러 추가
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
    );
};

export default SearchBar;
