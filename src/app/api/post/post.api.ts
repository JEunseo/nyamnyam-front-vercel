import { PostModel } from "src/app/model/post.model";
import { api } from "../request";
import { strategy } from "../api.strategy";

const getById = async (id:number): Promise<PostModel> =>{
    const response = await strategy.GET(`${api.post}/${id}`)
    return response.data;
};

const getByRestaurant = async (restaurantId: number) => {
    const response = await strategy.GET(`${api.post}/${restaurantId}/group`);
    return response.data;
};

const insert = async (formData: FormData): Promise<number> => {
  const response = await strategy.POST_MULTIPART(`${api.post}`, formData);
  return response.data;
};

const update = async (formData: FormData): Promise<number> => {
  const response = await strategy.PUT_MULTIPART(`${api.post}`, formData);
  return response.data;
};

const remove = async (postId: number) => {
    const response = await strategy.DELETE(`${api.post}/${postId}`);
    return response;
};

const listById = async (userId:string) => {
    const response = await strategy.GET(`${api.post}/list/${userId}`);
    return response.data;

}

export const post = { getById, getByRestaurant, insert, update, remove, listById };

