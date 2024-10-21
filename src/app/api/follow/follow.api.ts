import {api} from "src/app/api/request";
import {strategy} from "src/app/api/api.strategy";
import {FollowModel} from "@/app/model/follow.model";


const showFollower = async (nickname : string): Promise<FollowModel[]> => {
    try {
        const resp = await strategy.GET(`${api.follow}/findMyFollower/${nickname}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to fetch user counts");
        throw new Error("Failed to fetch user counts");
    }
};

const showFollowing = async (nickname : string): Promise<FollowModel[]> => {
    try {
        const resp = await strategy.GET(`${api.follow}/findMyFollowing/${nickname}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to fetch user counts");
        throw new Error("Failed to fetch user counts");
    }
};

const isFollow = async (follower: string, following: string): Promise<boolean> => {
    try {
        const response = await strategy.GET(`${api.follow}/${follower}/${following}/isFollow`);
        return response.data; // 데이터 반환
    } catch (error) {
        console.error("Failed to fetch notice details:", error);
        throw new Error("Failed to fetch notice details");
    }
}

const registerFollow = async (follow: FollowModel) => {
    try {
        const resp = await strategy.POST(`${api.follow}`, follow);
        return resp.data;
    } catch (error) {
        console.error("Failed to register follow:", error);
        throw new Error("Failed to register follow");
    }
}

const deleteFollow = async (follower: string, following: string): Promise<boolean> => {
    try {
        const resp = await strategy.DELETE(`${api.follow}/${follower}/${following}`)
        return resp.data;
    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }
}


export const follow = {showFollower, showFollowing, isFollow, registerFollow, deleteFollow}