import { strategy } from "../api.strategy";
import { api } from "../request";


export const fetchAllWishLists = async (userId: number) => {
    return await strategy.GET(api.wishList + '/getAll', { userId });
};

export const wishLists = async (userId: number) => {
    return await strategy.GET(api.wishList , { userId });
};

export const addWishList = async (name: string, userId: number) => {
    return await strategy.POST(api.wishList + `?name=${name}`, { userId });
};

export const addRestaurantToWishList = async (wishListId: number, restaurantId: number, userId: number) => {
    return await strategy.POST(api.wishList + `/${wishListId}?restaurantId=${restaurantId}`, { userId });
};

export const removeRestaurantFromWishList = async (restaurantId: number, userId: number) => {
    return await strategy.DELETE_PARAMS(api.wishList + `?restaurantId=${restaurantId}`, { userId });
};
