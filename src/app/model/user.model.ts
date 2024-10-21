export interface User {
    id: string;
    username: string;
    password: string;
    nickname: string;
    name: string;
    age: number | null;
    tel: string;
    gender: string;
    enabled: boolean;
    role: string;
    imgId: string | null;
    score: number;
}
