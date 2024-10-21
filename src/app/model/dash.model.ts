export interface CountItem {
    nickname: string;
    count: number;
}

export interface Area {
    area: string;
    total: number;
}

export interface RestaurantList {
    restaurantName: string;
    total: number;
}

export interface CountCost {
    date : string;
    price : number;
}

export interface UserPostModel {
    postId: number;
    content: string;
    name: string;
    restaurantId: number;
    entryDate: string;
    upvoteCount: number;
}

export interface ReportCountModel {
    postId: number;
    content: string;
    count: number;
}
