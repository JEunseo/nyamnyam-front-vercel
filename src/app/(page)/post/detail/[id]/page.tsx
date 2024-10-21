"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Star from "src/app/components/Star";
import { PostModel } from "src/app/model/post.model";
import { postService } from "src/app/service/post/post.service";
import nookies from "nookies";

export default function PostDetail() {
  const [post, setPost] = useState<PostModel | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const { id } = useParams();
  const router = useRouter();

  const cookies = nookies.get();
  const currentUserId = cookies.userId;

  const role = localStorage.getItem('role');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if(!id) return;
    try {
      const postId = Array.isArray(id) ? Number(id[0]) : Number(id);
      const {postData, images} = await postService.detailsPostAndImages(postId);

      setPost(postData); 
      setImages(images);
    }catch(error) {
      console.error("Error loading data:", error);
    }
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
          router.push(`/admin/dash`);
      } else {
          alert("삭제 중 오류가 발생했습니다.");
      }
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-100" style={{ marginTop: '30px' }}>
      <h1 className="text-2xl font-bold mb-6">상세게시글</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row border border-[#F46119] rounded-lg p-4 shadow-lg bg-white">
            <div className="md:w-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold mb-2">닉네임: {post?.nickname || '닉네임 없음'}</h2>
              </div>
              <div className="inline-flex space-x-2 mb-2">
                <Star w="w-6" h="h-6" readonly={true} rate={post?.averageRating} />
                <h1>{post?.averageRating.toFixed(1)} / 5</h1>
              </div>
              <div className="mb-2">
                <p className="text-gray-700">{post?.content}</p>
              </div>
              <div className="flex flex-col space-y-2 mb-2">
                <div className="inline-flex space-x-2">
                  <p>맛: </p>
                  <Star w="w-4" h="h-4" readonly={true} rate={post?.taste} />
                </div>
                <div className="inline-flex space-x-2">
                  <p>청결: </p>
                  <Star w="w-4" h="h-4" readonly={true} rate={post?.clean} />
                </div>
                <div className="inline-flex space-x-2">
                  <p>서비스: </p>
                  <Star w="w-4" h="h-4" readonly={true} rate={post?.service} />
                </div>
              </div>
              <div className="mb-4">
                {images.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`이미지 ${index + 1}`}
                        className="w-48 h-auto rounded-lg shadow-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <p>이미지 없음</p>
                )}
              </div>
              <div className="mb-2 flex items-center">
                <h2 className="text-lg font-bold mb-2 flex-shrink-0 self-center">태그: </h2>
                {post?.tags && post.tags.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 ml-2 items-center">
                    {post.tags.map((tag, index) => (
                      <li
                        key={index}
                        className="rounded-full border border-[#F46119] bg-white px-2 py-1 text-[#F46119]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>태그 없음</p>
                )}
              </div>
              <div className="flex justify-between items-center mb-2 text-gray-500">
              {post?.entryDate && formDate(post.entryDate)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
        {post?.userId === currentUserId || role === 'ADMIN' && (
          <>
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
              onClick={() => router.push(`/post/${post.restaurantId}/update/${id}`)}
            >
              수정하기
            </button>
            <button
              className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mr-2"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </>
        )}
      </div>
      </div>
     
    </main>
  );  
}