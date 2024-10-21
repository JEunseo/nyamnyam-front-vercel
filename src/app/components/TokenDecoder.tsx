import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import nookies from 'nookies';

interface DecodedToken {
    id: string;
    username: string;
    role: string;
    nickname: string;
    exp: number;
}

const TokenDecoder: React.FC<{ onDecode: (decoded: DecodedToken | null) => void }> = ({ onDecode }) => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);

        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
                onDecode(decoded); // 부모 컴포넌트에 디코딩된 토큰 전달

                // nookies를 사용하여 UserId 쿠키 저장
                nookies.set(null, 'userId', decoded.id, { path: '/' });

                // 로컬 스토리지에 nickname과 role 저장
                localStorage.setItem('nickname', decoded.nickname);
                localStorage.setItem('username', decoded.username);
                localStorage.setItem('role', decoded.role);
            } catch (error) {
                console.error('토큰 디코딩 실패:', error);
                onDecode(null);
            }
        } else {
            onDecode(null);
        }
    }, []); // 빈 의존성 배열 사용

    return null; // 렌더링할 내용 없음
};

export default TokenDecoder;
