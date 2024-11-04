'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useRouter } from 'next/navigation'
import { ReplyModel } from 'src/app/model/reply.model'
import { PostModel } from 'src/app/model/post.model'
import { postService } from 'src/app/service/post/post.service'
import { imageService } from 'src/app/service/image/image.service'
import { fetchRestaurantService, getRestaurantDetails } from 'src/app/service/restaurant/restaurant.service'
import { upvoteService } from 'src/app/service/upvote/upvote.service'
import { replyService } from 'src/app/service/reply/reply.service'
import Star from 'src/app/components/Star'
import { tag } from 'src/app/api/tag/tag.api';
import PostOptions from 'src/app/components/PostOptions';
import { ReportModel } from 'src/app/model/report.model';
import Modal from 'src/app/components/Modal';
import { fetchReportRegister } from '@/app/service/report/report.service';
import { PostListProps } from '@/app/model/props';
import nookies from 'nookies';
import {User} from "@/app/model/user.model";
import Account from "@/app/(page)/user/account/page";
import {getUserById} from "@/app/service/user/user.service";
import ReplyHandler from './reply/page';

const PostList: React.FC<Partial<PostListProps>> = ({ restaurantId }) => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [restaurant, setRestaurant] = useState<RestaurantModel | null>(null);
    const [images, setImages] = useState<{ [key: number]: string[] }>({});
    const [allImages, setAllImages] = useState<string[]>([]);
    const [imgDetails, setImgDetails] = useState<{ postId: number; url: string }[]>([]);
    const [likedPost, setLikedPosts] = useState<number[]>([]);
    const [likeCount, setLikeCounts] = useState<{ [key: number]: number }>({});
    const [replyToggles, setReplyToggles] = useState<{ [key: number]: boolean }>({});
    const [replies, setReplies] = useState<{ [key: number]: ReplyModel[] }>({});
    const [allAverage, setAllAverage] = useState<number>(0);
    const [tags, setTags] = useState<string[]>([]);
    const [top5Tags, setTop5Tags] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [currentImg, setCurrentImg] = useState<string>('');
    const [sort, setSort] = useState<'date' | 'rating' | 'likes'>('date');
    const [visible, setVisible] = useState(2);
    const [reportingPostId, setReportingPostId] = useState<number | null>(null);
    const [reportReason, setReportReason] = useState<string>("");
    const router = useRouter();
    const currentUserId = nookies.get().userId;
    const nickname = localStorage.getItem('nickname') || '';
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    // 신고하기
    const reportReasons = [
        "광고글이에요",
        "해당 식당에서 찍은 사진이 아니에요",
        "별점과 후기 내용이 일치하지 않아요",
        "비속어가 포함되어 있어요",
        "다른 사용자에게 불쾌감을 주는 포스트예요",
        "공개하면 안되는 개인정보가 포함되어 있어요",
        "악의적인 포스트를 지속적으로 작성하는 사용자예요",
        "기타 사유"
    ];

    useEffect(() => {
        if (restaurantId) {
            fetchPosts(restaurantId);
            fetchRestaurant();
            fetchImgByRestaurant(restaurantId);
            fetchRestaurantDetails(restaurantId);
            fetchTopTags(restaurantId);
        }
    }, [restaurantId]);

    const fetchPosts = async (restaurantId: number) => {
        try {
            const postData = await postService.fetchPost(restaurantId);

            setPosts(postData.map((data) => data.post));
            setLikedPosts(postData.filter((data) => data.liked).map((data) => data.post.id));

            setLikeCounts(
                postData.reduce((acc, data) => {
                    acc[data.post.id] = data.count;
                    return acc;
                }, {} as { [key: number]: number })
            );

            const updatedImages: { [key: number]: string[] } = {};
            const updatedDetails: { postId: number; url: string }[] = [];

            for (const data of postData) {
                const imageURLs = await imageService.getByPostId(data.post.id);
                updatedImages[data.post.id] = imageURLs;
                imageURLs.forEach(url => {
                    updatedDetails.push({ postId: data.post.id, url });
                });

            }
            setImages(updatedImages);
            setImgDetails(updatedDetails);

        } catch (error) {
            console.error("loadPosts error:", error);
        }
    };

    const fetchRestaurant = async () => {
        if (restaurantId) {
            const data = await fetchRestaurantService(restaurantId);
            if (data) setRestaurant(data);
        }
    };

    const fetchImgByRestaurant = async (restaurantId: number) => {
        const imageURLs = await imageService.getByRestaurantId(restaurantId);
        setAllImages(imageURLs);
    }

    const fetchRestaurantDetails = async (restaurantId: number) => {
        const { allAverage, tags } = await getRestaurantDetails(restaurantId);
        setAllAverage(allAverage);
        setTags(tags);
    }

    const fetchTopTags = async (restaurantId: number) => {
        const top5Tags = await tag.getTop5Tags(restaurantId);
        setTop5Tags(top5Tags);
    }

    // 이미지 modal 
    const openModal = (imageURL: string) => {
        setCurrentImg(imageURL);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const handleDelete = async (postId: number) => {
        if (window.confirm("게시글을 삭제하시겠습니까?")) {
            const success = await postService.remove(postId);

            if (success) {
                alert("게시글이 삭제되었습니다.");
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

                setImages((prevImages) => {
                    const updatedImages = { ...prevImages };
                    delete updatedImages[postId];
                    return updatedImages;
                })

                const updatedDetails = imgDetails.filter((detail) => detail.postId !== postId);
                setImgDetails(updatedDetails);

                setAllImages(updatedDetails.map((detail) => detail.url));

                router.push(`/restaurant/${restaurantId}`);
            }
        }
    };

    // 정렬 
    const sortedPosts = posts.slice().sort((a, b) => {
        switch (sort) {
            case 'date':
                return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
            case 'rating':
                return b.averageRating - a.averageRating;
            case 'likes':
                return (likeCount[b.id] || 0) - (likeCount[a.id] || 0);
            default:
                return 0;
        }
    })

    // View More
    const handleViewMore = () => {
        if(visible >= sortedPosts.length){
            setVisible(2);
        } else {
            setVisible((prevVisible) => prevVisible + 2);
        }
    }
    const visiblePosts = sortedPosts.slice(0, visible);

    // 댓글 버튼
    const toggleReply = async (id: number) => {
        const { toggled, replies } = await replyService.toggle(id, replyToggles);

        setReplyToggles(toggled);
        setReplies((prevReplies) => ({
            ...prevReplies,
            [id]: replies || prevReplies[id],
        }));
    };

    // 날짜 포맷 지정 
    const formatDate = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
        const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);

        const [year, month, day] = formattedDate.split('.').map(part => part.trim());
        return `${year}년 ${month}월 ${day}일`;
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

    // 신고하기
    const postReport = async (postId: number) => {
        const selectedReason = reportReason;

        if (!selectedReason) {
            alert("신고 사유를 선택해주세요.");
            return;
        }

        const reportModel: ReportModel = {
            userId: currentUserId,
            postId: postId,
            reason: selectedReason,
            entryDate: ''
        };

        try {
            await fetchReportRegister(reportModel);
            alert('신고가 성공적으로 제출되었습니다.');

        } catch (error) {
            console.error('신고 중 오류 발생:', error);
            alert('신고 중 오류가 발생했습니다.');
        }
    };

    const handleReportClick = (postId: number) => {
        setReportingPostId(postId);
        setReportReason("");
    };

    const handleReportSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (reportingPostId !== null) {
            await postReport(reportingPostId);
            setReportingPostId(null);
        }
    };

    const openUserModal = async (userId: string) => {
        try {
            const user = await getUserById(userId);
            setSelectedUser(user);
            setIsUserOpen(true);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setIsUserOpen(false);
    }

    return (
        <>
            <div className="product-detail default" style={{ marginTop: '30px' }}>
                <div className="review-block md:py-10 py-10 bg-surface">
                    <div className="heading flex items-center justify-between flex-wrap gap-4">
                        <div className="heading4">{`${restaurant?.name}`}
                            <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }} className='ml-2'>Review</span>
                        </div>
                        <button
                            className='button-main custom-button'
                            onClick={() => router.push(`/post/register/${restaurantId}`)}
                        >
                            Write Reviews
                        </button>
                    </div>
                    <div className="top-overview flex justify-between py-6 max-md:flex-col gap-y-6">
                        <div className="rating lg:w-1/4 md:w-[30%] lg:pr-[75px] md:pr-[35px]">
                            <div className="heading flex items-center justify-center flex-wrap gap-3 gap-y-4">
                                <div className="text-display">{allAverage.toFixed(1)}</div>
                                <div className='flex flex-col items-center'>
                                    <Star w="w-4" h="h-4" readonly={true} rate={allAverage || 0} />
                                    <div className='text-secondary text-center mt-1'>({posts.length} Ratings)</div>
                                </div>
                            </div>
                            <div className="list-rating mt-3">
                                {top5Tags.map((tag, index) => {
                                    const tagCount = [10, 8, 6, 4, 2];
                                    const totalTag = tagCount.reduce((sum, count) => sum + count, 0);
                                    const percent = totalTag > 0 ? (tagCount[index] / totalTag) * 100 : 0;

                                    return (
                                        <div key={index} className="item flex items-center justify-between gap-1.5">
                                            <div className="flex items-center gap-1">
                                                <div className="rounded-full border border-gray-300 bg-white px-3 py-1 text-gray-600 font-semibold shadow-sm hover:bg-gray-100 mb-1"
                                                    style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}>
                                                    {tag}</div>
                                            </div>
                                            <div className="progress bg-line relative w-3/4 h-2">
                                                <div
                                                    className="progress-percent absolute bg-yellow h-full left-0 top-0"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                            <div className="caption1">{percent.toFixed(0)}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="list-img lg:w-3/4 md:w-[70%] lg:pl-[15px] md:pl-[15px]">
                            <div className="heading5">All Image ({allImages.length})</div>
                            <div className="list md:mt-6 mt-3">
                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={3}
                                    modules={[Navigation]}
                                    navigation
                                    breakpoints={{
                                        576: { slidesPerView: 4, spaceBetween: 16, },
                                        640: { slidesPerView: 5, spaceBetween: 16, },
                                        768: { slidesPerView: 4, spaceBetween: 16, },
                                        992: { slidesPerView: 5, spaceBetween: 20, },
                                        1100: { slidesPerView: 5, spaceBetween: 20, },
                                        1290: { slidesPerView: 7, spaceBetween: 20, },
                                    }}
                                >
                                    {allImages.map((imageURL, index) => (
                                        <SwiperSlide key={index}>
                                            <Image
                                                src={imageURL} alt={`Restaurant Image ${index + 1}`}
                                                width={400} height={400}
                                                className='w-[120px] aspect-square object-cover rounded-lg'
                                                onClick={() => {
                                                    openModal(imageURL)
                                                }}
                                            />
                                        </SwiperSlide>
                                    ))}

                                </Swiper>
                                <Modal
                                    isOpen={isOpen} onClose={closeModal} closeButton={false}>
                                    <div className='relative'>
                                        <Image
                                            src={currentImg} alt="Modal Image"
                                            width={800} height={800}
                                            className='rounded-lg' />
                                    </div>
                                </Modal>
                            </div>
                            <div className="sorting flex items-center flex-wrap md:gap-5 gap-3 gap-y-3 mt-6">
                                <div className="text-button">Sort by</div>
                                <div onClick={() => setSort('date')} className="sorting-button item px-4 py-1 border rounded-full ${sort === 'date' ? 'active' : ''}"
                                >Newest</div>
                                <div onClick={() => setSort('rating')} className="sorting-button item px-4 py-1 border rounded-full ${sort === 'rating' ? 'active' : ''}"
                                >Rating</div>
                                <div onClick={() => setSort('likes')} className="sorting-button item px-4 py-1 border rounded-full ${sort === 'likes' ? 'active' : ''}"
                                >Likes</div>
                            </div>
                        </div>
                    </div>
                    <div className="list-review">
                        <>
                            {visiblePosts.map((p) => (
                                <div key={p.id} className="item flex max-lg:flex-col gap-y-4 w-full py-6 border-t border-line">
                                    <div className="left lg:w-1/4 w-full lg:pr-[15px]">
                                        <div className="flex gap-2">
                                            {images[p.id] && images[p.id].length > 0 ? (
                                                images[p.id].map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`이미지 ${index + 1}`}
                                                        className="w-[60px] aspect-square rounded-lg"
                                                        onClick={() => openModal(url)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="w-[60px] aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500">No Image</span>
                                                </div>
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
                                            <div className="flex text-title" onClick={() => openUserModal(p.userId)}>
                                                <Icon.IdentificationCard size={24} style={{ marginRight: '4px' }} />
                                                {p.nickname}
                                            </div>
                                            <Modal isOpen={isUserOpen} onClose={closeUserModal}>
                                                {selectedUser && <Account selectUser={selectedUser} />}
                                            </Modal>
                                            <div className="flex items-center gap-2">
                                                <div className="flex text-secondary2">
                                                    <Icon.Calendar size={24} style={{ marginRight: '4px' }} />
                                                    {formatDate(p.entryDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right lg:w-3/4 w-full lg:pl-[15px]">
                                        <div className="flex items-center justify-between">
                                            <div className='flex items-center'>
                                                <Star w="w-4" h="h-4" readonly={true} rate={p.averageRating} />
                                                <p className='ml-2'>{p.averageRating.toFixed(1)} / 5</p>
                                            </div>
                                            <PostOptions
                                                postUserId={p.userId ?? ''}
                                                currentId={currentUserId}
                                                onEdit={() => { router.push(`/post/${restaurantId}/update/${p.id}`) }}
                                                onDelete={() => handleDelete(p.id)}
                                                onReport={() => handleReportClick(p.id)}
                                            />
                                        </div>
                                        {reportingPostId === p.id && (
                                            <div className="mt-4">
                                                <form onSubmit={handleReportSubmit} className="flex flex-col">
                                                    <label className="text-gray-700 mb-2">신고 사유를 선택하세요:</label>
                                                    <select
                                                        value={reportReason}
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        className="border rounded p-2 mb-4"
                                                    >
                                                        <option value="">선택하세요</option>
                                                        {reportReasons.map((reason, index) => (
                                                            <option key={index} value={reason}>{reason}</option>
                                                        ))}
                                                    </select>
                                                    <div className='flex justify-end mt-4'>
                                                        <button type="submit" className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded">
                                                            신고하기
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setReportingPostId(null)}
                                                            className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded">
                                                            취소
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle">맛:</p>
                                                <div className="flex items-center">
                                                    <Star w="w-2" h="h-2" readonly={true} rate={p.taste} />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle">청결:</p>
                                                <div className="flex items-center">
                                                    <Star w="w-2" h="h-2" readonly={true} rate={p.clean} />
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium mb-0 mr-1 leading-none align-middle">서비스:</p>
                                                <div className="flex items-center">
                                                    <Star w="w-2" h="h-2" readonly={true} rate={p.service} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="body1 mt-3 mb-3">{p.content}</div>
                                        <div className="flex items-center justify-start h-auto">
                                            {p.tags && p.tags.length > 0 ? (
                                                <ul className="flex flex-wrap gap-2 items-center justify-center h-full">
                                                    {p.tags.map((tag, index) => (
                                                        <li
                                                            key={index}
                                                            style={{ marginLeft: index === 0 ? 0 : "8px", lineHeight: "32px" }}
                                                            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-gray-600 font-semibold shadow-sm hover:bg-gray-100">
                                                            {tag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="ml-2 text-gray-500">태그 없음</p>
                                            )}
                                        </div>
                                        <div className="action mt-1">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleLike(p.id, p.userId)}
                                                    className="like-btn flex items-center gap-1 cursor-pointer">
                                                    <Icon.Heart
                                                        size={18}
                                                        color={likeCount[p.id] > 0 ? "#FF0000" : "#9FA09C"}
                                                        weight="fill"
                                                    />
                                                    <div className="text-button">{likeCount[p.id] || 0}</div>
                                                </button>
                                                <button onClick={() => toggleReply(p.id)} className="flex reply-btn text-button text-secondary cursor-pointer hover:text-black">
                                                    댓글 <Icon.ChatCircleDots size={24} style={{ marginLeft: "4px" }} />
                                                </button>
                                            </div>
                                            <ReplyHandler
                                                postId={p.id}
                                                initialReplies={replies[p.id]}
                                                currentId={currentUserId}
                                                isOpen={replyToggles[p.id]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                        <div className='flex justify-center'>
                            {sortedPosts.length > 2 && (
                                <div className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
                                    onClick={handleViewMore}>
                                    {visible >= sortedPosts.length ? "Hide Reviews" : "View More Reviews"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PostList
