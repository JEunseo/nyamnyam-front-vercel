"use client";
import './globals.css';
import StoreProvider from './StoreProvider';
import { useSearchContext } from './components/SearchContext';
import { useEffect, useState } from 'react';
import TabFeatures from './(page)/restaurant/page';
import { useRouter } from 'next/navigation';
import Home from './(page)/home/page';

const Page = () => {
    const { searchTerm } = useSearchContext();
    const [isTabVisible, setIsTabVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (searchTerm) {
            setIsTabVisible(false);
            router.push('/home'); // 검색어가 있을 때 Home으로 리디렉션
        } else {
            setIsTabVisible(true);
            router.push('/'); // 검색어가 없을 때 TabFeatures로 이동
        }
    }, [searchTerm]);

    return (
        <StoreProvider>
            {isTabVisible ? <TabFeatures start={0} limit={10} /> : <Home />}
        </StoreProvider>
    );
};

export default Page;