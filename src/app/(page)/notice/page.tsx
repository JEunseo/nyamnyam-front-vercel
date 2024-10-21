"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NoticeModel } from "src/app/model/notice.model";
import {fetchNoticeList, fetchDeleteNotice} from "src/app/service/notice/notice.service"; // 삭제 API 추가
import Link from "next/link";
import { useSearchContext } from "@/app/components/SearchContext";

const PAGE_SIZE = 10; // 페이지당 표시할 공지사항 수

export default function ShowNotice() {
    const [notice, setNotice] = useState<NoticeModel[]>([]);
    const { searchTerm } = useSearchContext();
    const router = useRouter();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNoticeIds, setSelectedNoticeIds] = useState<number[]>([]); // 선택된 공지사항 ID 배열 상태

    useEffect(() => {
        const loadNotices = async () => {
            try {
                const notices = await fetchNoticeList();
                setNotice(notices);
            } catch (error) {
                console.error("공지사항을 불러오는 데 오류가 발생했습니다:", error);
            }
            const role = localStorage.getItem('role') || null;
            setRole(role)
        };

        loadNotices(); // 함수 호출
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (searchTerm && !isInitialLoad) {
            router.push(`/?search=${searchTerm}`);
        }
    }, [searchTerm]);

    const moveToOne = (id: number) => {
        router.push(`/notice/details/${id}`);
    };

    const moveToInsert = () => {
        router.push('/notice/register'); // 공지사항 추가 페이지로 이동
    };

    const moveDashboard = () => {
        router.push('/admin/dashboard');
    };

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(notice.length / PAGE_SIZE);
    // 현재 페이지에 해당하는 공지사항 목록
    const currentNotices = notice.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // 공지사항 삭제 함수
    const handleDelete = async () => {
        if (selectedNoticeIds.length > 0) {
            try {
                await Promise.all(selectedNoticeIds.map(id => fetchDeleteNotice(id))); // 선택된 공지사항 삭제 API 호출
                setNotice(prevNotices => prevNotices.filter(n => !selectedNoticeIds.includes(n.id))); // 상태 업데이트
                setSelectedNoticeIds([]); // 선택 초기화
            } catch (error) {
                console.error("공지사항 삭제 중 오류가 발생했습니다:", error);
            }
        }
    };

    // 체크박스 상태 관리
    const handleCheckboxChange = (id: number) => {
        setSelectedNoticeIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(prevId => prevId !== id); // 체크 해제
            } else {
                return [...prevIds, id]; // 체크
            }
        });
    };

    return (
        <main className="flex min-h-screen flex-col items-center" style={{ marginTop: '30px' }}>
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                    <tr className="bg-[#F46119] text-white">
                        <th className="py-3 px-4 border-b"></th>
                        <th className="py-3 px-4 border-b">제목</th>
                        <th className="py-3 px-4 border-b">조회수</th>
                        <th className="py-3 px-4 border-b">날짜</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentNotices.map((n) => (
                        <tr key={n.id}
                            className="item duration-300 border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-center"
                            onClick={() => moveToOne(n.id)}
                        >
                            <td className="py-3 px-4 border-b">
                                {role === 'ADMIN' && (
                                    <input
                                        type="checkbox"
                                        checked={selectedNoticeIds.includes(n.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleCheckboxChange(n.id);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                )}
                            </td>
                            <td className="py-3 px-4 border-b">
                                <Link href={`/product/default/${n.id}`}>
                                    <div className="info flex flex-col">
                                        {n.title}
                                    </div>
                                </Link>
                            </td>
                            <td className="py-3 px-4 border-b">{n.hits}</td>
                            <td className="py-3 px-4 border-b">{n.date}</td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                {role === 'ADMIN' && (
                <div className="flex mt-4">
                    <button
                        onClick={handleDelete}
                        disabled={selectedNoticeIds.length === 0}
                        className="p-2 bg-red-500 rounded hover:bg-red-400 transition duration-200 text-white"
                    >
                        삭제하기
                    </button>
                </div>
                    )}
                <div className="flex justify-between mt-4 space-x-2 w-full">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 bg-[#eca459] rounded hover:bg-gray-400 transition duration-200 text-white text-border"
                    >
                        이전
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-[#eca459] rounded hover:bg-gray-400 transition duration-200 text-white text-border"
                    >
                        다음
                    </button>
                </div>
            </div>

            {role === 'ADMIN' && (
                <div className="flex flex-col mt-6 space-y-4 text-left">
                    <button onClick={moveToInsert}
                            className="p-2 bg-[#41B3A3] text-white rounded hover:bg-blue-700 transition duration-200 ">
                        공지사항 추가하기
                    </button>
                </div>
            )}
        </main>
    );
}
