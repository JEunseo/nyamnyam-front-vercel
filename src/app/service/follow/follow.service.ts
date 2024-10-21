import {FollowModel} from "@/app/model/follow.model";
import {follow} from "@/app/api/follow/follow.api";
import {NoticeModel} from "@/app/model/notice.model";
import {notice} from "@/app/api/notice/notice.api";


export const fetchShowFollower = async (nickname: string): Promise<FollowModel[]> => {
    const data = follow.showFollower(nickname);
    return data;
}

export const fetchShowFollowing = async (nickname: string): Promise<FollowModel[]> => {
    const data = follow.showFollowing(nickname);
    return data;
}

export const fetchIsFollow = async (follower: string, following: string): Promise<boolean> => {
    const data = follow.isFollow(follower, following);
    return data;
}

export const fetchRegisterFollow = async (followModel: FollowModel): Promise<NoticeModel> => {
    const data = follow.registerFollow(followModel);
    return data;
}

export const fetchDeleteFollow = async (follower: string, following: string): Promise<boolean> => {
    try {
        const data = follow.deleteFollow(follower, following);
        return data;
    } catch (error) {
        console.error("Failed to create notice:", error);
        throw error;
    }
}




