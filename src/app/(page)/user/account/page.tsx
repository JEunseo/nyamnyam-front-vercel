"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { User } from "@/app/model/user.model";
import nookies from "nookies";
import Link from "next/link";
import { fetchDeleteFollow, fetchIsFollow, fetchRegisterFollow } from "@/app/service/follow/follow.service";
import { FollowModel } from "@/app/model/follow.model";
import { insertChatRoom } from '@/app/service/chatRoom/chatRoom.api';
import { useRouter } from 'next/navigation';
import {fetchUserById} from "@/app/api/user/user.api";

interface AccountProps {
    selectUser: User;
}


export default function Account(selectUser: Partial<AccountProps>) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const cookie = nookies.get();
    const userId = cookie.userId;
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const myInfo = await fetchUserById(userId);
                setUser(myInfo);
            } catch (error) {
                console.error("Error fetching user:", error);
            }

            if (selectUser.selectUser) {
                setSelectedUser(selectUser.selectUser);
            }

            const checkFollowStatus = async () => {
                const followingUser = selectUser?.selectUser.nickname;
                const result = await fetchIsFollow(followingUser, user.nickname);
                setIsFollowing(result);
            };

            await checkFollowStatus();
        };

        fetchData();
    }, [selectUser, userId]);

    const handleFollow = async () => {
        const followModel: FollowModel = {
            id: 0,
            follower: selectUser?.selectUser.nickname,
            following: user.nickname,
        };

        try {
            await fetchRegisterFollow(followModel);
            setIsFollowing(true);
        } catch (error) {
            console.error("Failed to follow:", error);
        }
    };

    const handleUnfollow = async () => {

        const follower = selectUser?.selectUser.nickname
        const following = user.nickname


        try {
            await fetchDeleteFollow(follower, following);
            setIsFollowing(false);
        } catch (error) {
            console.error('Failed to unfollow:', error);
        }
    };

    const handleCreateChatRoom = async (e: React.FormEvent) => {
        e.preventDefault(); // 페이지 새로고침 방지

        // ChatRoom 객체 생성
        const newChatRoom: any = {
            name: "님과의 채팅방", // 입력된 채팅방 이름
            participants: [selectedUser.nickname, selectUser.selectUser.nickname], // 초기 참가자 목록에 입력된 참가자 추가
        };

        // 참가자 목록 체크
        const participantsList = newChatRoom.participants.length > 0
            ? newChatRoom.participants.join(", ")
            : "참가자가 없습니다"; // 참가자가 없을 경우 기본 메시지

        const result = await insertChatRoom(newChatRoom);
        console.log(result);
        if (result.status === 200) {
            alert("채팅방이 성공적으로 생성되었습니다.");
             // 채팅방 정보를 URL 쿼리 파라미터로 전달
             const createdChatRoom = result.data;
             console.log(createdChatRoom); 
             router.push(`/chatRoom?id=${createdChatRoom.id}`); // 생성된 채팅방의 ID와 이름을 쿼리로 전달           
        }

          
    };


    return (
        <div className="w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
            <div className="user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                <div className="heading flex flex-col items-center justify-center">
                    <div className="avatar">
                        <Image
                            src={'/assets/img/profile.png'}
                            width={300}
                            height={300}
                            alt='avatar'
                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                        />
                    </div>
                    <div className="name heading6 mt-4 text-left">{selectUser?.selectUser?.nickname}</div>
                    <div className="mail heading6 font-normal normal-case text-secondary mt-1 text-sm text-left">
                        냠냠온도: {selectUser?.selectUser?.score}
                    </div>
                </div>
                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                    <div className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg">
                        <h5 className="heading6"></h5>
                    </div>
                </div>
                {
                    selectUser.selectUser?.id === userId ? (
                        <Link href="/user/follow" passHref>
                            <button type="submit"
                                className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                                팔로우
                            </button>
                        </Link>
                    ) : isFollowing ? (
                        <button
                            onClick={handleUnfollow}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            언팔로우
                        </button>
                    ) : (
                        <button onClick={handleFollow}
                            className="px-4 py-2 bg-[#41B3A3] text-white rounded hover:bg-[#178E7F]">
                            팔로우하기
                        </button>
                    )
                }
                <button
                    className="px-4 py-2 ml-4 bg-[#3A9181] text-white rounded hover:bg-[#2C7365]"
                    onClick={handleCreateChatRoom} // 버튼 클릭 시 함수 실행
                >
                    채팅하기
                </button>

            </div>
        </div>
    );
}
