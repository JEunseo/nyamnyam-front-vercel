"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Context의 타입 정의
interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Context 생성
const SearchContext = createContext<SearchContextProps>({
  searchTerm: '',
  setSearchTerm: () => { },
});

// Provider 컴포넌트 생성
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Context를 사용하기 위한 커스텀 훅
// export const useSearchContext = () => useContext(SearchContext);
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};