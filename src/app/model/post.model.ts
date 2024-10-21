import { ImageModel } from "./image.model";

//src/app/model/post.model.ts
export interface PostModel {
  id: number;  
  taste: number;
  clean: number;
  service: number;
  content: string;
  entryDate: string;
  modifyDate: string;
  averageRating: number;
  tags?: string[]; 
  images: ImageModel[];
  restaurantId?: number;
  userId: string;
  nickname: string;
  restaurantName?: string
}

export const initialPost: PostModel = {
  id: 0,  
  taste: 0,
  clean: 0,
  service:0,
  content: '',
  entryDate: '',
  modifyDate: '',
  averageRating: 0,
  tags: [], 
  images: [],
  restaurantId: 0,
  userId: '',
  nickname:''
}

