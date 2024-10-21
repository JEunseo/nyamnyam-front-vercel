"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {NoticeModel} from "src/app/model/notice.model";
import {fetchNoticeRegister} from "src/app/service/notice/notice.service";

export default function InsertNotice() {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);


    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newNotice: NoticeModel = {
            id: 0,
            title,
            content,
            date: new Date().toISOString(),
            hits: 0
        };

        try {
            await fetchNoticeRegister(newNotice);
            alert('공지사항이 성공적으로 추가되었습니다!');
            router.push('/notice');
        } catch (error) {
            console.error("Insert error:", error);
        }
    };


    if (role !== 'ADMIN') {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>권한이 없습니다</h2>
                <p>You do not have permission to view this content.</p>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">공지사항 추가</h2>
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
                        추가
                    </button>
                </form>
            </div>
        </main>
    );
}
