import {admin} from "src/app/api/admin/admin.api";
import {Area, CountCost, CountItem, RestaurantList} from "src/app/model/dash.model";
import {PostModel} from "@/app/model/post.model";


export const fetchShowCount = async (): Promise<CountItem[]> => {
    const data = await admin.showCount();
    return data.slice(0, 5);
};

export const fetchShowArea = async (): Promise<Area[]> => {
    const data = await admin.showArea();
    return data;
}

export const fetchShowRestaurant = async (): Promise<RestaurantList[]> => {
    const data = await admin.showRankRestaurant();
    return data;
}

export const fetchRestaurantOne = async (id: string): Promise<RestaurantModel> => {
    const data: RestaurantModel = await admin.showRestaurant(id);
    return data;
}


export const fetchReceiptList = async (): Promise<CountCost[]> => {
    const data = await admin.receiptList();
    return data;
}

export const fetchUpvoteRestaurant = async (): Promise<RestaurantList[]> => {
    const data = await admin.upvoteRestaurant();
    return data;
}

export const fetchTypeCount = async (id : string): Promise<CountItem[]> => {
    const data = await admin.typeCount(id);
    return data.slice(0, 5);
};

export const fetchAreaCount = async (id : string): Promise<Area[]> => {
    const data = await admin.areaCount(id);
    return data.slice(0, 5);
};

export const fetchCurrentPost = async(): Promise<PostModel[]> => {
    const data = await admin.currentPost();
    return data;

}











