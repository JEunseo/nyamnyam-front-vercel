"use client";
import React, { useEffect, useState } from 'react';
import nookies from "nookies";
import { fetchUserById } from "@/app/api/user/user.api";
import { fetchShowFollower, fetchShowFollowing } from "@/app/service/follow/follow.service";
import { User } from "@/app/model/user.model";
import { FollowModel } from "@/app/model/follow.model";
import Account from "@/app/(page)/user/account/page";
import Modal from "@/app/components/Modal";

export default function FollowList() {
    const [activeTab, setActiveTab] = useState(0);
    const cookies = nookies.get();
    const userId = cookies.userId;
    const [user, setUser] = useState<User | null>(null);
    const [follower, setFollower] = useState<FollowModel[]>([]);
    const [following, setFollowing] = useState<FollowModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await fetchUserById(userId);
            setUser(userData);
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchFollowData = async () => {
            if (user?.nickname) {
                const followerData = await fetchShowFollower(user.nickname);
                const followingData = await fetchShowFollowing(user.nickname);
                setFollower(followerData)
                setFollowing(followingData)
            }
        };
        fetchFollowData();
    }, [user]);

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <>
            {/* 탭 버튼 */}
            <div className="flex space-x-4">
                <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                    <button
                        className={`py-2 px-4 ${activeTab === 0 ? 'border-b-4 border-b-green-700' : ''}`}
                        onClick={() => setActiveTab(0)}
                    >
                        팔로우
                    </button>
                </div>
                <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                    <button
                        className={`py-2 px-4 ${activeTab === 1 ? 'border-b-4 border-b-green-700' : ''}`}
                        onClick={() => setActiveTab(1)}
                    >
                        팔로잉
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {activeTab === 0 && (
                    <div>
                        <h2 className="text-lg font-bold">팔로워 목록</h2>
                        {follower.length > 0 ? (
                            follower.map((follow) => (
                                <div key={follow.id} className="p-2 border-b border-gray-300">
                                    {follow.following}
                                </div>
                            ))
                        ) : (
                            <p>팔로워가 없습니다.</p>
                        )}
                    </div>
                )}
                {activeTab === 1 && (
                    <div>
                        <h2 className="text-lg font-bold">팔로잉 목록</h2>
                        {following.length > 0 ? (
                            following.map((follow) => (
                                <div key={follow.id} className="p-2 border-b border-gray-300">
                                    {follow.follower}
                                </div>
                            ))
                        ) : (
                            <p>팔로잉한 사람이 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedUser && <Account selectUser={selectedUser} />}
            </Modal>
        </>
    );
}
