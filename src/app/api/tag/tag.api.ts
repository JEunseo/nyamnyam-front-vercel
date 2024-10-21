import { TagModel } from "src/app/model/tag.model";
import instance from "../axios";
import { api } from "../request";
import { strategy } from "../api.strategy";

// 모든 태그 반환
const getAllTags = async () => {
    const response = await strategy.GET(`${api.tag}/group`);
    return response.data;
};

// 카테고리별 리스트 
const getByCategories = async () => {
    const response = await strategy.GET(`${api.tag}/category`);
    return response.data;
};

// 태그의 카테고리만 반환 
const getCategoryNames = async () => {
    const response = await strategy.GET(`${api.tag}/tag-category`)
    return response.data;
};

// 특정 이름의 태그 조회
const getTagByName = async (name: string) => {
    const response = await strategy.GET(`${api.tag}/${name}`)
    return response.data;
};

const getTop5Tags = async (restaurantId: number) => {
  const response = await strategy.GET(`${api.tag}/top5/${restaurantId}`);
  return response.data;
}


const insert= async (formData: TagModel) => {
  const response = await strategy.POST(api.tag, formData); 
  return response.data;
};

const remove= async (name: string) => {
  const response = await strategy.DELETE(`${api.tag}/${name}`);
  return response;
};

export const tag = {getAllTags, getByCategories, getCategoryNames, getTagByName, getTop5Tags ,insert, remove}; 