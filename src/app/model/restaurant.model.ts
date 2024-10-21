interface RestaurantModel {
    id?: number|any;
    name?: string|any;
    type?: string;
    address?: string;
    tel?: string;
    rate?: number;
    thumbnailImageUrl?: string|any;
    subImageUrl?: string;
    menu: string; 
    operation: string;  
    lat?: number;
    lng?: number;
}   