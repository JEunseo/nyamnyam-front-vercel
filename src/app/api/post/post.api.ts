import axios from "axios";
import { PostModel } from "src/app/model/post.model";
import instance from "../axios";
import { api } from "../request";

export async function insertPost(post: PostModel): Promise<any | {status: number}> {
  try {
    const body = {
        id: post.id, 
        content: post.content,
        taste: post.taste,
        clean: post.clean,
        service: post.service,
        entryDate: post.entryDate,
        modifyDate: post.modifyDate,
        tags:post.tags,
        restaurantId:post.restaurantId
    }
    const response = await fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');

    if (response.ok && contentType?.includes('application/json')) {
      const data: any = await response.json();
      return data;
    } else {
      const errorMessage = await response.text();
      throw new Error(`Server returned non-JSON response: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error occurred while inserting post:', error);
    return {status: 500};
  }
}

export const fetchPost = async (restaurantId: number) => {
  try{
    const response = await instance.get(`${api.post}/${restaurantId}/group`);
    return response.data;
  }catch(error){
    console.error("fetchPosts API error:", error);
    throw error;
  }
}

export const deletePost = async (postId: number) => {
  try {
    const response = await instance.delete(`${api.post}/${postId}`);
    return response;
  } catch (error) {
    console.error('Delete operation failed:', error);
    throw error;
  }
};


// likeCount, likeChecked, getimg 한번에 가져오기 