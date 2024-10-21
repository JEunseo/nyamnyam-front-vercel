/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true, // SWC 활성화
    experimental: {
        esmExternals: false, // ESM 외부 모듈 처리 비활성화 시도
    },
    images: {
        domains: ['search.pstatic.net', 'kr.object.ncloudstorage.com'], // 여기에 사용하려는 이미지 도메인 추가
    },

    webpack: (config, {isServer}) => {
        config.cache = false; // 캐시 비활성화
        return config;
    },


    env: {
        // env는 서버측에서만 사용가능하기 때문에 next.config.js에서
        // 환경변수로 추가해주어야 클라이언트에서 접근 가능
        KAKAO_MAP_APP_KEY: process.env.KAKAO_MAP_APP_KEY,
    },
};


export default nextConfig;
