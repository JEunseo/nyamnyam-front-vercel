//src/app/api/axios.ts

import axios from "axios";

export const instance  = axios.create ({
    baseURL : process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL || "http://localhost:8080", 
}); 

export const instance1  = axios.create ({
    baseURL : process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL || "http://localhost:8080", 
}); 

// JWT 토큰 헤더에 포함하기(리덕스 axios instance 설정)
// instance.interceptors.request.use(
//     // 요청을 보내기 전 수행되는 함수
//     function (config) {
//       console.log("인터셉터 요청 성공!");
//       return config;
//     },
  
//     // 오류 요청을 보내기 전 수행되는 함수
//     function (error) {
//       console.log("인터셉터 요청 오류!");
//       return Promise.reject(error);
//     }
//   );
  
//   instance.interceptors.response.use(
//     // 응답을 내보내기 전 수행되는 함수
//     function (response) {
//       console.log("인터셉터 요청을 받았습니다.");
//       return response;
//     },
  
//     // 오류 응답을 내보내기 전 수행되는 함수
//     function (error) {
//       console.log("인터셉터 응답 오류발생.");
  
//       return Promise.reject(error);
//     }
//   ); 

export default instance;