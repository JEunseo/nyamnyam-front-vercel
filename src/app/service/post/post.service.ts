import { post} from "src/app/api/post/post.api";
import { getLikeCount, upvote} from "src/app/api/upvote/upvote.api";
import { PostModel } from "src/app/model/post.model";
import { imageService } from "../image/image.service";
import { image } from "src/app/api/image/image.api";
import {UserPostModel} from "src/app/model/dash.model";
import nookies from 'nookies';

const update = async (formData: FormData): Promise<void> => {
  try {
    await post.update(formData);
  } catch (error) {
    console.error('Error in updatePostService:', error);
    throw error;
  }
}

// 하나의 post 데이터 가져오기 
const getPostDetails = async (id:number): Promise<PostModel> => {
  try{
    const postData = await post.getById(id); 
    return postData;
  }catch(error){
    console.error("Error in fetchPostData:", error);
    throw error;
  }
}

const detailsPostAndImages = async (postId: number): Promise<{ postData: any; images: string[] }> => {
  try {
    const postData = await post.getById(postId);
    const images = await image.getByPostId(postId);
    return { postData, images };
  } catch (error) {
    console.error("Error loading post and images:", error);
    throw error;
  }
}

const insert = async (formData: FormData): Promise<number> => {
  try {
    const postId = await post.insert(formData);
    return postId;
  } catch (error) {
    console.error('Error occurred while inserting post:', error);
    throw error;
  }
}

const fetchPost = async (restaurantId: number) => {
  try {
    const posts: PostModel[] = await post.getByRestaurant(restaurantId);

    const likeStatusPromise = posts.map(async (post) => {
      const userId = nookies.get().userId;
      const liked = await upvote.hasLiked({ id: 0, giveId: userId, postId: post.id});
      const count = await getLikeCount(post.id);
      const images = await imageService.getByPostId(post.id);

      return { post, liked, count, images }
    })
    const result = await Promise.all(likeStatusPromise);
    return result;
  } catch (error) {
    console.error("fetchPostsService error:", error);
    throw error;
  }
}

const remove = async (postId: number) => {
  try {
    const response = await post.remove(postId);
    if (response.status === 200 || response.status === 204) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error in deletePostService:', error);
    return false;
  }
};


export const fetchPostList = async (userId : string) => {
  const data: UserPostModel[] = await post.listById(userId);
  return data.sort((a, b) => {
    return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
  });

};

export const postService = {update, getPostDetails, detailsPostAndImages, insert, fetchPost, remove};