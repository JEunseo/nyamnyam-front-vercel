//src/app/api/image
import { strategy } from "../api.strategy";
import instance from "../axios";
import { api } from "../request";

const getByRestaurantId = async (restaurantId: number): Promise<string[]> => {
    try {
      const response = await instance.get(`${api.image}/restaurant/${restaurantId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

const getByPostId = async (postId: number): Promise<string[]> => {
    const response = await strategy.GET(`${api.image}/post/${postId}`);
    return response.data.map((image: any) => image.uploadURL);
};

const getByImgId = async (postId: number): Promise<number[]> => {
    const response = await strategy.GET(`${api.image}/post/${postId}/imageIds`);
    return response.data;
};

const upload = async (postId: number, images: File[]): Promise<void> => {
    const imageData = new FormData();
    images.forEach((file) => imageData.append('files', file));
    imageData.append('postId', postId.toString());

    await strategy.POST(`/api/images/upload/${postId}`, imageData);
};

const update = async (postId: number, images: File[]): Promise<void> => {
    const imageData = new FormData();
    images.forEach((file) => imageData.append('files', file));
    imageData.append('postId', postId.toString());

    await strategy.PUT(`${api.image}/${postId}`, imageData);
};

const remove = async (imageId: number): Promise<void> => {
    await instance.delete(`/api/images/${imageId}`);
};

export const image = {getByRestaurantId, getByPostId, getByImgId, upload, update, remove};