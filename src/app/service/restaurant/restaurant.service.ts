
// restaurant/page.tsx의 service

import {
restaurant

} from "src/app/api/restaurant/restaurant.api";
import {number} from "prop-types";
import {NoticeModel} from "src/app/model/notice.model";
import {notice} from "src/app/api/notice/notice.api";

export const getRestaurantAll = async () => {
  return await restaurant.fetchRestaurantAll();
}

export const getRestaurantsBySearch = async (keyword: string) => {
    return await restaurant.fetchRestaurantsBySearch(keyword);
};

export const getRestaurantsByTag = async (tags: string[]) => {
    return await restaurant.fetchRestaurantsByTag(tags);
};

export const getRestaurantsByCategory = async (categories: string[]) => {
    return await restaurant.fetchRestaurantsByCategory(categories);
};


// restaurant/[id]/page.tsx api

export const getRestaurantDetails = async (id: number) => {
    const restaurants = await restaurant.fetchRestaurantById(id);
    const allAverage = await restaurant.fetchAllAverage(id);
    const tags = await restaurant.fetchTopTags(id);
    return { restaurants, allAverage, tags };
};


// post에 restautant 불러오기
export const fetchRestaurantService = async (restaurantId: number): Promise<RestaurantModel | null> => {
    try {
      const restaurantData = await restaurant.fetchRestaurant(restaurantId);
      return restaurantData;
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return null;
    }
  };
