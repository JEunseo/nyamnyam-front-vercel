"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useParams } from "next/navigation";
import Star from "../../../../components/Star";
import { PostModel } from "src/app/model/post.model";
import { postService } from "src/app/service/post/post.service";
import { tag } from "src/app/api/tag/tag.api";
import { TagModel } from "src/app/model/tag.model";
import { restaurant } from '@/app/api/restaurant/restaurant.api';
import { Camera, X } from '@phosphor-icons/react/dist/ssr';
import Modal from '@/app/components/Modal';
import { useDropzone } from 'react-dropzone';

import nookies from 'nookies';

export default function PostRegister() {
  const router = useRouter();
  const { restaurantId } = useParams();
  const [restaurantName, setRestaurantName] = useState<RestaurantModel | null>(null);
  const [formData, setFormData] = useState<PostModel>({} as PostModel);
  const [tagsByCategory, setTagsCategory] = useState<{ [key: string]: TagModel[] }>({});
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Modal

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      restaurantId: Number(restaurantId)
    }));
    fetchTagCategory();
    fetchRestaurant(Number(restaurantId));
  }, [restaurantId]);

  useEffect(() => {
  }, [images]);

  const fetchRestaurant = async (restaurantId: number) => {
    const data = await restaurant.fetchRestaurantById(restaurantId);
    setRestaurantName(data);
  }

  const fetchTagCategory = async () => {
    try {
      const result = await tag.getByCategories();
      setTagsCategory(result);
      setTags([]);
    } catch (error) {
      console.error("태그 목록을 불러오는데 실패했습니다.", error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setTags(prevSelected =>
      prevSelected.includes(tag)
        ? prevSelected.filter(t => t !== tag)
        : [...prevSelected, tag]
    );
  };

  const handleStar = (value: number, field: keyof PostModel) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]); 
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = {
      userId: nookies.get().userId,
      nickname: localStorage.getItem('nickname'),
      content: formData.content,
      taste: formData.taste,
      clean: formData.clean,
      service: formData.service,
      tags: tags,
      restaurantId: formData.restaurantId
    };
    
    const newFormData = new FormData();

    newFormData.append("model", new Blob([JSON.stringify(postData)], {type: "application/json"}));

    images.forEach((file) => {
      newFormData.append("files", file);
    })
    try {
      const postId: number = await postService.insert(newFormData);
      if (postId) {
        setTags([]);
        router.push(`/post/${restaurantId}/details/${postId}`);
      }
    } catch (error) {
      console.error('Post submission failed:', error);
    }
  };

  // Drag & Drop
  const {getRootProps, getInputProps} = useDropzone({
    accept: {'image/*': []},
    onDrop: (acceptedFiles) =>{
      setImages((prevImg) => [...prevImg, ...acceptedFiles]);
    },
  });

  // Modal
  const handleImgClick = (image: File) => {
    setSelectedImage(URL.createObjectURL(image));
    setIsOpen(true);
  }

  const handleDeleteImage = (fileName: string) => {
    setImages((prevImages) => prevImages.filter(img => img.name !== fileName));
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6" style={{ marginTop: '30px' }}>
      <div className='heading4 mb-2'>
        <span style={{ color: '#F46119', fontSize: 'inherit', fontWeight: 'inherit' }}>
          {restaurantName?.name}
        </span> 리뷰 작성하기
      </div>
      <form className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 항목별 평점</h2>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">맛</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.taste}
              onChange={(rating) => handleStar(rating, "taste")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">청결</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.clean}
              onChange={(rating) => handleStar(rating, "clean")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">서비스</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={formData.service}
              onChange={(rating) => handleStar(rating, "service")}
            />
          </div>
        </div>

        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 음식점 키워드</h2>
          {Object.keys(tagsByCategory).map(category => (
            <div key={category} className="mb-4">
              <div className="font-semibold mb-2">
                {category === "방문목적" && "이 식당은 어떤 방문목적에 적합한가요?"}
                {category === "분위기" && "이 식당의 분위기를 선택해주세요."}
                {category === "편의시설" && "이 식당은 어떤 편의시설이 있나요?"}
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsByCategory[category].map(tag => (
                  <div key={tag.name} className="flex items-center mr-2 mb-2">
                    <input
                      type="checkbox"
                      id={tag.name}
                      name={tag.name}
                      value={tag.name}
                      onChange={() => handleTagSelect(tag.name)}
                      className="absolute opacity-0 peer"
                    />
                    <label
                      htmlFor={tag.name}
                      className="peer-checked:bg-[#FDE8D8] peer-checked:text-[#F46119] peer-checked:border-[#F46119] flex items-center justify-center cursor-pointer rounded-full border border-gray-400 bg-white text-gray-600 px-3 py-1 transition duration-200 ease-in-out shadow-sm hover:bg-[#FDE8D8] hover:text-[#F46119]"
                      style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}
                    >
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 방문후기</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="border rounded p-2 w-full mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 이미지 첨부</label>
          <div {...getRootProps()} 
          className='flex flex-col justify-center items-center border border-dashed border-gray-400 rounded-lg p-4 mt-2 cursor-pointer text-gray-500 relative'>
            <input {...getInputProps()} className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'/>
            <label
              htmlFor="imageUpload"
              className='flex flex-col items-center justify-center cursor-pointer text-gray-500 z-10 w-full'
              style={{ minHeight: '30px'}}
            >
              <Camera size={32} className='mb-2' color="#4B5563" weight="fill" />
              <span className='font-medium'>사진 첨부하기</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`미리보기 이미지 ${index + 1}`}
                    className="w-[120px] h-[120px] object-cover rounded-lg"
                    onClick={() => handleImgClick(image)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.name)}
                    className="absolute top-1 right-1 text-white font-bold"
                  >
                    <X size={24} weight='bold'/>
                  </button>
                </div>
              ))
            ) : (
              <p>선택된 파일 없음</p>
            )}
          </div>
          
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeButton={false}>
            {selectedImage && (
              <img src={selectedImage} alt="Modal 이미지" className="max-w-full max-h-screen rounded-lg" />
            )}
          </Modal>
        </div>
      </form>

      <div className="flex justify-end mt-6">
        <button type="button" className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleSubmit}>
          등록하기
        </button>
        <button
          type="button" className="button-main custom-button px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => router.push(`/restaurant/${restaurantId}`)}>
          뒤로가기
        </button>
      </div>
    </main>
  );
}
