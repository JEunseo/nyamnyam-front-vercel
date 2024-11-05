//src/app/api/axios.ts

import axios from "axios";

export const instance  = axios.create ({
    baseURL : process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL || "http://localhost:8080", 
}); 

export const instance1  = axios.create ({
    baseURL : process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL || "http://localhost:8081", 
}); 

export default instance;