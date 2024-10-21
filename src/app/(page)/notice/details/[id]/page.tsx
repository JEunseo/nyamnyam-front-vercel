"use client";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {fetchNoticeOne} from "src/app/service/notice/notice.service";
import {NoticeModel} from "src/app/model/notice.model";


export default function ShowNotice() {
    const [notice, setNotice] = useState<NoticeModel | null>(null);
    const router = useRouter();
    const {id} = useParams();
    const [role, setRole] = useState<string | null>(null);





    useEffect(() => {
        const fetchNotice = async (id: number) => {
            try {
                const response = await fetchNoticeOne(id);
                setNotice(response);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };


        const storedRole = localStorage.getItem('role');
        setRole(storedRole);


        if (id) {
            fetchNotice(Number(id));
        }
    }, [id]);


    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-white-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-10" >
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">

                    {notice ? (
                        <>
                            <tr className="bg-[#F46119] text-white">
                                <th className="py-3 px-4 border-b">제목</th>
                                <td className="py-3 px-4 border-b">{notice.title}</td>
                            </tr>
                            <tr>
                            <th className="py-3 px-4 border-b">조회수</th>
                                <td className="py-3 px-4 border-b">{notice.hits}</td>
                            </tr>
                            <tr>
                                <th className="py-3 px-4 border-b">작성일</th>
                                <td className="py-3 px-4 border-b">{notice.date}</td>
                            </tr>
                            <tr>
                                <th className="py-3 px-4 border-b">내용</th>
                                <td className="py-3 px-4 border-b">{notice.content}</td>
                            </tr>


                        </>
                    ) : (

                        <tr>
                            <td className="py-3 px-4 border-b" colSpan={3}>로딩 중...</td>
                        </tr>

                    )}
                </table>
                {role === 'ADMIN' && (
                    <div className="mt-4">
                        <button
                            onClick={() => router.push(`/notice/update/${id}`)}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]"
                        >
                            수정하기
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
