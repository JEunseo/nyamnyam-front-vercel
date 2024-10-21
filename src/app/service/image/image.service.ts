import { image } from "src/app/api/image/image.api";

async function insert(postId: number, images: File[]): Promise<any | {status: number}> {
  try {
    await image.upload(postId, images); 
    return {status: 200};
  } catch (error) {
    console.error('Error occurred while inserting image:', error);
    return {status: 500};
  }
}

const getByPostId = async (postId: number): Promise<string[]> => {
  try{
    const imageURLs = await image.getByPostId(postId); 
    return imageURLs;
  }catch(error){
    console.error("Error fetching images:", error);
    return [];
  }
};

const getByRestaurantId = async (restaurantId: number): Promise<string[]> => {
  try {
    const response = await image.getByRestaurantId(restaurantId); 
    return Array.isArray(response) ? response : []; 
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};

export const imageService = {insert, getByPostId, getByRestaurantId};


