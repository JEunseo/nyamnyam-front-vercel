// src/components/EmojiPicker.tsx
import React from 'react';
import { emojiList } from 'src/data/emojiList';

// props 타입 지정
interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '10px',
        width: '300px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px', // 이모지 사이 간격 설정
        maxHeight: '300px',
        overflowY: 'auto', // 스크롤바 추가
      }}
    >
      {emojiList.map((emoji, index) => (
        <span
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            margin: '4px',
            transition: 'transform 0.2s ease-in-out, background-color 0.3s',
            padding: '5px', // 클릭 영역 확대
            borderRadius: '8px', // 버튼 모서리 둥글게
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.2)';
            e.currentTarget.style.backgroundColor = '#f0f0f0'; // 마우스 오버 시 배경색 변경
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'transparent'; // 배경색 초기화
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiPicker;