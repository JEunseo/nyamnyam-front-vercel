import { upvote } from "src/app/api/upvote/upvote.api";
import { initialUpvote, UpvoteModel } from "src/app/model/upvote.model";

const check = async (postId: number, userId: string) => {
    const upvoteData: UpvoteModel = {
        ...initialUpvote,
        giveId: userId,
        postId, 
    }
    return await upvote.hasLiked(upvoteData);
};

const toggle = async ( postId: number,userId: string, likedPost: number[]
  ): Promise<{ likedPost: number[]; likeCountDelta: number }> => {
    const upvoteData: UpvoteModel = { id: 0, giveId: userId, postId};

    if (likedPost.includes(postId)) {
        const success = await upvote.unLike(upvoteData);
        return success
          ? { likedPost: likedPost.filter((id) => id !== postId), likeCountDelta: -1 }
          : { likedPost, likeCountDelta: 0 };
      } else {
        const success = await upvote.like(upvoteData);
        return success
          ? { likedPost: [...likedPost, postId], likeCountDelta: 1 }
          : { likedPost, likeCountDelta: 0 };
      }
    };

export const upvoteService = {check, toggle};