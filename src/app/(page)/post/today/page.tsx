"use client";

import { PostModel } from "@/app/model/post.model";
import { fetchCurrentPost } from "@/app/service/admin/admin.service";
import { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { fetchRestaurantService } from "@/app/service/restaurant/restaurant.service";
import Link from "next/link";
import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import Star from "@/app/components/Star";
import { ReplyModel } from "@/app/model/reply.model";
import { replyService } from "@/app/service/reply/reply.service";
import nookies from 'nookies';
import { upvoteService } from "@/app/service/upvote/upvote.service";
import ReplyHandler from "../[restaurantId]/reply/page";
import { useMutation } from "@tanstack/react-query";

export default function TodayPost() {
    const [todayPosts, setTodayPosts] = useState<PostModel[]>([]);
    const [currentImg, setCurrentImg] = useState<string>('');
    const [replyToggles, setReplyToggles] = useState<{ [key: number]: boolean }>({});
    const [replies, setReplies] = useState<{ [key: number]: ReplyModel[] }>({});
    const [likedPost, setLikedPosts] = useState<number[]>([]);
    const [likeCount, setLikeCounts] = useState<{ [key: number]: number }>({});
    const [isOpen, setIsOpen] = useState(false);
    const currentUserId = nookies.get().userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const todayData = await fetchCurrentPost();

                const postWithRestaurantNames = await Promise.all(
                    todayData.map(async (post) => {
                        const restaurant = await fetchRestaurantService(post.restaurantId)
                        return { ...post, restaurantName: restaurant.name };
                    })
                )
                setTodayPosts(postWithRestaurantNames);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    // 댓글 버튼
    const toggleReply = async (id: number) => {
        const { toggled, replies } = await replyService.toggle(id, replyToggles);
    
        setReplyToggles(toggled); 
        setReplies((prevReplies) => ({
            ...prevReplies,
            [id]: replies || prevReplies[id],
        }));
    };

    // 좋아요 & 취소 & count
    const handleLike = async (postId: number, postUserId: string) => {
        if (postUserId === currentUserId) {
            window.alert("본인의 리뷰에는 좋아요를 누를 수 없어요.");
            return;
        }

        const result = await upvoteService.toggle(postId, currentUserId, likedPost);

        if (result) {
            setLikedPosts(result.likedPost);
            setLikeCounts((prevCounts) => ({
                ...prevCounts,
                [postId]: (prevCounts[postId] || 0) + result.likeCountDelta,
            }))
        }
    };

    const openModal = (imageURL: string) => {
        setCurrentImg(imageURL);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const formDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };
        const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(date);
        const [year, month, day] = formattedDate.split(".").map((part) => part.trim());
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <main className="product-detail default mx-auto" style={{ marginTop: '20px', maxWidth: '1024px' }}>
            <div className="heading4 text-center">
                <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>
                    오늘
                </span>
                <span style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
                    의 리뷰
                </span>
            </div>
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6 mx-auto">
                {todayPosts.length > 0 ? (
                    todayPosts.map((post, index) => (
                        <div key={index} className="flex flex-col md:flex-row border border-[#F46119] rounded-lg p-4 shadow-lg bg-white mb-4 mt-4">
                            <div className="list-review flex flex-col lg:flex-row gap-4 w-full">
                                <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                    <div className="mb-4">
                                        {post.images && post.images.length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                                {post.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image.uploadURL}
                                                        alt={`이미지 ${index + 1}`}
                                                        className="w-[60px] aspect-square rounded-lg"
                                                        onClick={() => openModal(image.uploadURL)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p>이미지 없음</p>
                                        )}
                                    </div>
                                    <Modal isOpen={isOpen} onClose={closeModal} closeButton={false}>
                                        <div className='relative'>
                                            <Image
                                                src={currentImg} alt="Modal Image"
                                                width={800} height={800}
                                                className='rounded-lg' />
                                        </div>
                                    </Modal>

                                    <div className="user mt-3">
                                        <div className="flex text-title">
                                        <Icon.IdentificationCard size={24} color='#F46119' style={{marginRight: '4px'}}/>
                                            {post?.nickname || '닉네임 없음'}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-secondary2">
                                            <Icon.Calendar size={24} color='#F46119' style={{marginRight: '4px'}}/>
                                                {post?.entryDate && formDate(post.entryDate)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                <div className="heading5">
                                    <Link href={`/restaurant/${post?.restaurantId}`}>
                                    <span style={{ display: 'flex' ,color: '#F46119', fontSize: '24px !important', fontWeight: 'bold' }}>
                                        <ForkKnife size={24} weight="bold" style={{ marginRight: '8px' }}/>
                                        {post?.restaurantName}</span>
                                    </Link>
                                </div>

                                    <div className='flex items-center'>
                                        <Star w="w-6" h="h-6" readonly={true} rate={post?.averageRating} />
                                        <p className='ml-2'>{post?.averageRating.toFixed(1)} / 5</p>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle">맛: </p>
                                            <div className="flex items-center">
                                                <Star w="w-4" h="h-4" readonly={true} rate={post?.taste} />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle whitespace-nowrap">청결: </p>
                                            <div className="flex items-center">
                                                <Star w="w-4" h="h-4" readonly={true} rate={post?.clean} />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle whitespace-nowrap">서비스: </p>
                                            <div className="flex items-center">
                                                <Star w="w-4" h="h-4" readonly={true} rate={post?.service} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="body1 mt-3 mb-3">{post?.content}</div>

                                    <div className="flex items-center justify-start h-auto">
                                        {post?.tags && post.tags.length > 0 ? (
                                            <ul className="flex flex-wrap gap-2 items-center justify-center h-full">
                                                {post.tags.map((tag, index) => (
                                                    <li
                                                        key={index}
                                                        style={{ marginLeft: index === 0 ? 0 : "8px", lineHeight: "32px" }}
                                                        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-gray-600 font-semibold shadow-sm hover:bg-gray-100">
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>태그 없음</p>
                                        )}
                                    </div>
                                    <div className="action mt-1">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleLike(post?.id, post?.userId)}
                                                    className="like-btn flex items-center gap-1 cursor-pointer">
                                                    <Icon.Heart
                                                        size={18}
                                                        color={likeCount[post?.id] > 0 ? "#FF0000" : "#9FA09C"}
                                                        weight="fill"
                                                    />
                                                    <div className="text-button">{likeCount[post?.id] || 0}</div>
                                                </button>
                                                <button onClick={() => toggleReply(post?.id)} className="flex reply-btn text-button text-secondary cursor-pointer hover:text-black">
                                                    Reply <Icon.ChatCircleDots size={24} style={{ marginLeft: "4px" }} />
                                                </button>
                                            </div>
                                            <ReplyHandler
                                                postId={post?.id}
                                                initialReplies={replies[post?.id]}
                                                currentId={currentUserId}
                                                isOpen={replyToggles[post?.id]}
                                            />
                                        </div>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>오늘은 리뷰가 없습니다.</p>
                )}
            </div>
        </main>
    )
}