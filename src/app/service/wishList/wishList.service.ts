
// import {
//     addRestaurantToWishList,
//     addWishList,
//     fetchAllWishLists,
//     removeRestaurantFromWishList,
//     wishLists
// } from "src/app/api/wishList/wishList.api";

// // 모든 위시리스트 가져오기
// export const fetchAllWishListsService = async (userId: number) => {
//     return await fetchAllWishLists(userId);
// };

// // 유저별 위시리스트 목록 가져오기
// export const fetchWishListsService = async (userId: number) => {
//     return await wishLists(userId);
// };

// // 위시리스트 추가하기
// export const addWishListService = async (name: string, userId: number) => {
//     return await addWishList(name, userId);
// };

// // 식당을 위시리스트에 추가하기
// export const addRestaurantToWishListService = async (wishListId: number, restaurantId: number, userId: number) => {
//     return await addRestaurantToWishList(wishListId, restaurantId, userId);
// };

// // 위시리스트에서 식당 제거하기
// export const removeRestaurantFromWishListService = async (restaurantId: number, userId: number) => {
//     return await removeRestaurantFromWishList(restaurantId, userId);
// };




import {
    addRestaurantToWishList,
    addWishList,
    fetchAllWishLists,
    removeRestaurantFromWishList,
    wishLists
} from "src/app/api/wishList/wishList.api";

// 모든 위시리스트 가져오기
export const fetchAllWishListsService = async (userId: number) => {
    try {
        const response = await fetchAllWishLists(userId);
        return response.data; // AxiosResponse의 데이터 부분을 가져옴
    } catch (error) {
        console.error("Error fetching wish lists:", error);
        throw error; // 에러를 호출자에게 전달
    }
};


// 유저별 위시리스트 목록 가져오기
export const fetchWishListsService = async (userId: number) => {
    try {
        const response = await wishLists(userId);
        return response.data; // AxiosResponse의 데이터 부분을 가져옴
    } catch (error) {
        console.error("Error fetching wish lists:", error);
        throw error; // 에러를 호출자에게 전달
    }
};

// 위시리스트 추가하기
export const addWishListService = async (name: string, userId: number) => {
    try {
        const response = await addWishList(name, userId);
        return response.data; // AxiosResponse의 데이터 부분을 가져옴
    } catch (error) {
        console.error("Error adding wish list:", error);
        throw error; // 에러를 호출자에게 전달
    }
};

// 식당을 위시리스트에 추가하기
export const addRestaurantToWishListService = async (wishListId: number, restaurantId: number, userId: number) => {
    try {
        const response = await addRestaurantToWishList(wishListId, restaurantId, userId);
        console.log("식당이 위시리스트에 추가되었습니다.");
        return response.data; // AxiosResponse의 데이터 부분을 가져옴
    } catch (error) {
        console.error("Error adding restaurant to wish list:", error);
        throw error; // 에러를 호출자에게 전달
    }
};

// 위시리스트에서 식당 제거하기
export const removeRestaurantFromWishListService = async (restaurantId: number, userId: number) => {
    try {
        const response = await removeRestaurantFromWishList(restaurantId, userId);
        console.log("식당이 위시리스트에서 삭제되었습니다.");
        return response.data; // AxiosResponse의 데이터 부분을 가져옴
    } catch (error) {
        console.error("Error removing restaurant from wish list:", error);
        throw error; // 에러를 호출자에게 전달
    }
};
