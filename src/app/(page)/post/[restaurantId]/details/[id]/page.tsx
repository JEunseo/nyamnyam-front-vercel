"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Star from "src/app/components/Star";
import { PostModel } from "src/app/model/post.model";
import { postService } from "src/app/service/post/post.service";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import nookies from 'nookies';
import Modal from "@/app/components/Modal";
import Image from 'next/image'

export default function PostDetail() {
  const [post, setPost] = useState<PostModel | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState<string>('');
  const { id, restaurantId } = useParams();
  const router = useRouter();
  const currentUserId = nookies.get().userId;
  const nickname = localStorage.getItem('nickname') || '';

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const postId = Array.isArray(id) ? Number(id[0]) : Number(id);
      const { postData, images } = await postService.detailsPostAndImages(postId);

      setPost(postData);
      setImages(images);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

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

  const handleDelete = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      const postId = Array.isArray(id) ? Number(id[0]) : Number(id);
      const success = await postService.remove(postId);

      if (success) {
        alert("게시글이 삭제되었습니다.");
        router.push(`/restaurant/${restaurantId}`);
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="product-detail default" style={{ marginTop: '10px' }}>
      <div className="heading4">
        <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>
          {nickname}
        </span>
        <span style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
          님 리뷰
        </span>
      </div>
      <div className="flex flex-col md:flex-row border border-[#F46119] rounded-lg p-4 shadow-lg bg-white">
        <div className="list-review flex flex-col lg:flex-row gap-4">
          <div className="left lg:w-1/4 w-full lg:pr-[15px]">
            <div className="mb-4">
              {images.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`이미지 ${index + 1}`}
                      className="w-[60px] aspect-square rounded-lg"
                      onClick={() => openModal(url)}
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
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => router.push(`/restaurant/${restaurantId}`)}
        >
          목록
        </button>
        {post?.userId === currentUserId && (
          <>
            <button
              className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => router.push(`/post/${restaurantId}/update/${id}`)}
            >
              수정하기
            </button>
            <button
              className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </>
        )}
      </div>
    </main>
  );
}