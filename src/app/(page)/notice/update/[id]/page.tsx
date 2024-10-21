"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {fetchNoticeOne, fetchNoticeUpdate} from "src/app/service/notice/notice.service";
import {NoticeModel} from "src/app/model/notice.model";



export default function UpdateNotice() {
    const [notice, setNotice] = useState<NoticeModel | null>(null);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        const fetchNotice = async (id: number) => {
            if (!id) return;
            try {
                const response = await fetchNoticeOne(id);
                setNotice(response);
                setTitle(response.title); // 제목 초기화
                setContent(response.content); // 내용 초기화
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (id) {
            fetchNotice(Number(id));
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) {
            console.error("Notice ID is missing");
            return;
        }

        const updatedNotice: NoticeModel = {
            id: Number(id),
            title,
            content,
            date: new Date().toISOString(), // 현재 날짜를 ISO 형식으로
            hits: notice?.hits || 0 // 기존 조회수를 유지
        };

        try {
            await fetchNoticeUpdate(updatedNotice); // fetchNoticeUpdate 호출
            alert('공지사항이 성공적으로 업데이트되었습니다!');
            router.push(`/notice/details/${id}`);
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const role = localStorage.getItem('role');

    if (role !== 'ADMIN') {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>권한이 없습니다</h2>
                <p>You do not have permission to view this content.</p>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">공지사항 수정</h2>
                {notice ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            업데이트
                        </button>
                    </form>
                ) : (
                    <p>로딩 중...</p>
                )}
            </div>
        </main>
    );
}
