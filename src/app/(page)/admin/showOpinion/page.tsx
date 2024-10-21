"use client";
import React, {useEffect, useState} from "react";
import {fetchShowOpinion} from "src/app/service/opinion/opinion.serivce";
import {OpinionModel} from "src/app/model/opinion.model";
import styles from "src/css/mypage.module.css";
import {User} from "@/app/model/user.model";
import nookies from "nookies";
import {fetchUserById} from "@/app/api/user/user.api";

export default function ShowOpinion() {
    const [opinion, setOpinion] = useState<OpinionModel[]>([]);
    const [user, setUser] = useState<User | null>(null);

    const cookie = nookies.get();
    const userId = cookie.userId;

    useEffect(() => {
        const loadOpinions = async() => {

            const myInfo = await fetchUserById(userId);
            setUser(myInfo);

            try {
                const opinions = await fetchShowOpinion();
                setOpinion(opinions);
            } catch (error) {
                console.error("공지사항을 불러오는 데 오류가 발생했습니다:", error);
            }

        }
        loadOpinions()
    }, []);


    if (user?.role !== 'ADMIN') {
        return (
            <div className="unauthorized text-center mt-5">
                <h2>권한이 없습니다</h2>
                <p>You do not have permission to view this content.</p>
            </div>
        );
    }


    return (
            <div>
                <div>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-[#FDEBD8FF]">
                            <th className="py-3 px-4 border-b">번호</th>
                            <th className="py-3 px-4 border-b">내용</th>
                        </tr>
                        </thead>
                        <tbody>
                        {opinion.map((o) => (
                            <tr key={o.id} className=" text-black">
                                <th className="py-3 px-4 border-b">{o.id}</th>
                                <th className="py-3 px-4 border-b">{o.content}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
)
}