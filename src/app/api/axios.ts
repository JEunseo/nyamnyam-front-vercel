//src/app/api/axios.ts

import axios from "axios";

export const instance  = axios.create ({
    baseURL : "http://localhost:8080",
    withCredentials : true
}); 

export const instance1  = axios.create ({
    baseURL : process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL ,
    withCredentials : true
}); 

export default instance;