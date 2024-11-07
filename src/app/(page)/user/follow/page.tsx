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
            <div className="flex justify-center space-x-8 text-center">
                <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                    <button
                        className={`py-1 px-4 ${activeTab === 0 ? 'border-b-4 border-b-green-700' : ''}`}
                        onClick={() => setActiveTab(0)}
                    >
                        팔로우
                    </button>
                </div>
                <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                    <button
                        className={`py-1 px-4 ${activeTab === 1 ? 'border-b-4 border-b-green-700' : ''}`}
                        onClick={() => setActiveTab(1)}
                    >
                        팔로잉
                    </button>
                </div>
            </div>

            <div className="mt-4 text-center">
                {activeTab === 0 && (
                    <div>
                        {follower.length > 0 ? (
                            follower.map((follow) => (
                                <div key={follow.id} className="p-2 border-b border-gray-300">
                        <span className="tag px-4 py-1.5 rounded-full bg-blue-100 text-blue-800">
                            {follow.following}
                        </span>
                                </div>
                            ))
                        ) : (
                            <span className="tag px-4 py-1.5 rounded-full bg-red-100 text-red-500">
                           팔로워가 없습니다.
                        </span>
                        )}
                    </div>
                )}
                {activeTab === 1 && (
                    <div>
                        {following.length > 0 ? (
                            following.map((follow) => (
                                <div key={follow.id} className="p-2  border-gray-300">
                        <span className="tag px-4 py-1.5 rounded-full bg-green-100 text-green-800">
                            {follow.follower}
                        </span>
                                </div>
                            ))
                        ) : (
                            <span className="tag px-4 py-1.5 rounded-full bg-red-100 text-red-500">
                           팔로잉한 사람이 없습니다.
                        </span>

                            )}
                    </div>
                )}
            </div>


            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedUser && <Account selectUser={selectedUser}/>}
            </Modal>
        </>
    );
}
