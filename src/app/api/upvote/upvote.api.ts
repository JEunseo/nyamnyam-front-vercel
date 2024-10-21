import { UpvoteModel } from "src/app/model/upvote.model";
import { api } from "../request";
import { strategy } from "../api.strategy";

export const hasLiked = async (upvote: UpvoteModel): Promise<boolean> => {
    try{
        const response = await strategy.GET(`${api.post}/${upvote.postId}/hasLiked`, 
            { userId: upvote.giveId }
        );
        return response.data;
    }catch(error){
        console.error("hasLikePost API error:", error);
        return false;
    }
};

export const getLikeCount = async (postId:number): Promise<number> => {
    try{
        const response = await strategy.GET(`${api.post}/${postId}/like-count`);
        return response.data;
    }catch(error){
        console.error("getLikePost API error:", error);
        return 0;
    }
};

export const like = async (upvote: UpvoteModel): Promise<boolean> => {
    try{
        const response = await strategy.POST_PARAMS(`${api.post}/${upvote.postId}/like`,
            {userId: upvote.giveId}, {}
        );
        return response.data;
    } catch (error) {
        console.error("likePost API error:", error);
        return false;
    }
};

export const unLike = async (upvote: UpvoteModel):Promise<boolean> => {
    try{
        const response = await strategy.POST_PARAMS(`${api.post}/${upvote.postId}/unlike`,
            {userId: upvote.giveId},{}
        );
        return response.data;
    }catch(error){
        console.error("unLikePost API error:", error);
        return false;
    }
}

export const upvote = {hasLiked, getLikeCount, like, unLike}; 