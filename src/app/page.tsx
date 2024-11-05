"use client";
import './globals.css';
import StoreProvider from './StoreProvider';
import { useSearchContext } from './components/SearchContext';
import { useEffect, useMemo, useState } from 'react';
import TabFeatures from './(page)/restaurant/page';
import { useRouter } from 'next/navigation';
import Home from './(page)/home/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodayPost from './(page)/post/today/page';

const Page = () => {
    const { searchTerm } = useSearchContext();
    const [isTabVisible, setIsTabVisible] = useState(true);
    const router = useRouter();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: true, 
                staleTime: 0, 
            },
        },
    });

    useEffect(() => {
        // 페이지 로드 시 searchTerm에 따라 초기 상태 설정
        if (searchTerm) {
            setIsTabVisible(false);
            router.push('/home'); // 검색어가 있을 때 Home으로 리디렉션
        } else {
            setIsTabVisible(true);
            router.push('/'); // 검색어가 없을 때 TabFeatures로 이동
        }
    }, [searchTerm, router]);

    return (
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                {isTabVisible ? <TabFeatures start={0} limit={10} /> : <Home />}
            </StoreProvider>
        </QueryClientProvider>
    );
};

export default Page;