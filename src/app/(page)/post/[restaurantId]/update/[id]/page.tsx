"use client";

import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Star from 'src/app/components/Star';
import { initialPost, PostModel } from 'src/app/model/post.model';
import { TagModel } from 'src/app/model/tag.model';
import { postService } from 'src/app/service/post/post.service';
import { tagService } from 'src/app/service/tag/tag.service';
import { Camera, X } from '@phosphor-icons/react/dist/ssr';
import Modal from '@/app/components/Modal';
import { useDropzone } from 'react-dropzone';
import { ImageModel } from '@/app/model/image.model';

export default function PostUpdate() {
  const router = useRouter();
  const { restaurantId, id } = useParams();
  const [allTags, setAllTags] = useState<{ [category: string]: TagModel[] }>({});
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [allImages, setAllImages] = useState<(File | ImageModel)[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [postData, setPostData] = useState<PostModel>(initialPost);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof id === 'string' && id) {
      loadData(Number(id));
    }
  }, [id]);

  useEffect(() => {
  }, [allTags]);

  const loadData = async (id: number) => {
    try {
      const post = await postService.getPostDetails(id);

      const uniqueTags = Array.isArray(post.tags) ? Array.from(new Set(post.tags)) : [];
      setPostData({ ...post, tags: uniqueTags });
      setTags(uniqueTags);

      const prevImages = post.images || [];
      setAllImages([...prevImages]);

      const tagList = await tagService.fetchTag();
      setAllTags(tagList);

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
  
    const postDataJSON = JSON.stringify({
      id: postData.id,
      content: postData.content, 
      taste: postData.taste,
      clean: postData.clean,
      service: postData.service,
      tags: tags,
    });
  
    formData.append("postData", postDataJSON); 
  
    imagesToDelete.forEach((imageId) => {
      formData.append("imagesToDelete", String(imageId));
    });
  
    images.forEach((image) => {
      formData.append("files", image);
    });

    try {
      await postService.update(formData);
      router.push(`/post/${restaurantId}/details/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tag: string) => {
    setTags((prevSelected) => {
      const tagSet = new Set(prevSelected);
      if (tagSet.has(tag)) {
        tagSet.delete(tag);
      } else {
        tagSet.add(tag);
      }
      return Array.from(tagSet);
    });
  };

  const handleStar = (value: number, field: keyof PostModel) => {
    setPostData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
      setAllImages([...allImages, ...newFiles]);
    }
  };

  const handleDeleteImage = (id: number | string, type: 'prev' | 'new') => {
    setAllImages((prevImages) =>
      prevImages.filter((image) => ('id' in image ? image.id !== id : image.name !== id))
    );

    if (type === 'prev') {
      setImagesToDelete((prev) => [...prev, id as number]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles]);
      setAllImages((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleImgClick = (imageURL: string) => {
    setSelectedImage(imageURL);
    setIsOpen(true);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6" style={{ marginTop: '30px' }}>
      <div className='heading4 mb-2'>리뷰 수정하기</div>
      <form className="pace-y-4 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl" encType="multipart/form-data">
        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 항목별 평점</h2>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">맛</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={postData?.taste}
              onChange={(rating) => handleStar(rating, "taste")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">청결</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={postData?.clean}
              onChange={(rating) => handleStar(rating, "clean")}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block font-bold w-24">서비스</label>
            <Star
              w="w-8" h="h-8"
              readonly={false}
              rate={postData?.service}
              onChange={(rating) => handleStar(rating, "service")}
            />
          </div>
        </div>

        <div className="border-b-2 pb-4">
          <h2 className="font-bold text-lg mb-2">◦ 음식점 키워드</h2>
          {Object.keys(allTags).length > 0 ? (
            Object.keys(allTags).map(category => (
              <div key={category} className="mb-4">
                <div className="font-semibold mb-2">{category}</div>

                <div className="flex flex-wrap gap-4">
                  {(allTags[category] as TagModel[]).map(t => (
                    <div key={t.name} className="flex items-center mr-2 mb-2">
                      <input
                        type="checkbox"
                        id={t.name}
                        name={t.name} value={t.name}
                        checked={tags.includes(t.name)}
                        onChange={() => handleTagSelect(t.name)}
                        className="absolute opacity-0 peer"
                      />
                      <label htmlFor={t.name} className="peer-checked:bg-[#FDE8D8] peer-checked:text-[#F46119] peer-checked:border-[#F46119] flex items-center justify-center cursor-pointer rounded-full border border-gray-400 bg-white text-gray-600 px-3 py-1 transition duration-200 ease-in-out shadow-sm hover:bg-[#FDE8D8] hover:text-[#F46119]"
                        style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}>{t.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>태그가 없습니다.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 방문후기</label>
          <textarea
            id="content"
            name="content"
            value={postData?.content}
            onChange={handleChange}
            className="border rounded p-2 w-full mt-2"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="font-bold">◦ 이미지 첨부</label>
          <div {...getRootProps()} className="flex justify-center items-center border border-dashed border-gray-400 rounded-lg p-4 mt-4 cursor-pointer text-gray-500 relative">
            <input {...getInputProps()} className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0' />
            <label htmlFor="imageUpload"
              className='flex flex-col items-center justify-center cursor-pointer text-gray-500 z-10 w-full'
              style={{ minHeight: '30px' }}>
              <Camera size={32} className='mb-2' color="#4B5563" weight="fill" />
              <span className='font-medium'>사진 첨부하기</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {allImages.length > 0 &&
            allImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={'uploadURL' in image ? (image as ImageModel).uploadURL : URL.createObjectURL(image as File)}
                  alt={`이미지 ${index + 1}`}
                  className="w-[120px] h-[120px] object-cover rounded-lg cursor-pointer"
                  onClick={() =>
                    handleImgClick(
                      'uploadURL' in image
                        ? (image as ImageModel).uploadURL
                        : URL.createObjectURL(image as File)
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteImage(
                      'id' in image ? (image as ImageModel).id : (image as File).name,
                      'uploadURL' in image ? "prev" : "new"
                    )
                  }
                  className="absolute top-1 right-1 text-white font-bold">
                  <X size={24} weight='bold' />
                </button>
              </div>
            ))}
        </div>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeButton={false}>
          {selectedImage && (
            <img src={selectedImage} alt="Modal 이미지" className="max-w-full max-h-screen rounded-lg" />
          )}
        </Modal>

      </form>
      <div className="flex justify-end mt-6">
        <button type="button" className="button-main custom-button mr-2 px-4 py-2 bg-green-500 text-white rounded mt-2 mr-2"
          onClick={handleSubmit}>
          수정
        </button>
        <button type="button" className="button-main custom-button px-4 py-2 bg-green-500 text-white rounded mt-2"
          onClick={() => router.push(`/restaurant/${restaurantId}`)}>
          취소
        </button>
      </div>
    </main>
  );
}

