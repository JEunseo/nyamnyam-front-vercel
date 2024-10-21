// src/app/service/user.service.ts
import { User } from "src/app/model/user.model";
import {
    fetchUserExists,
    fetchUserById,
    fetchAllUsers,
    fetchUserCount,
    deleteUserById,
    updateUser,
    registerUser,
    loginUser, uploadThumbnailApi,
} from "src/app/api/user/user.api";

// 사용자 존재 여부 확인 서비스
export const checkUserExists = async (id: string): Promise<boolean> => {
    return await fetchUserExists(id);
};

// 사용자 정보 가져오기 서비스
export const getUserById = async (id: string): Promise<User> => {
    return await fetchUserById(id);
};

// 모든 사용자 가져오기 서비스
export const getAllUsers = async (): Promise<User[]> => {
    return await fetchAllUsers();
};

// 사용자 수 가져오기 서비스
export const getUserCount = async (): Promise<number> => {
    return await fetchUserCount();
};

// 사용자 삭제 서비스
export const removeUserById = async (id: string): Promise<void> => {
    await deleteUserById(id);
};

// 사용자 정보 업데이트 서비스
export const modifyUser = async (user: User): Promise<User> => {
    return await updateUser(user);
};

export const addUser = async (
    username: string,
    password: string,
    nickname: string,
    name: string,
    age: number | string,
    tel: string,
    gender: string,
    thumbnails: File[]
): Promise<User> => {
    const user: User = {
        id: '',
        username,
        password,
        nickname,
        name,
        age: typeof age === 'string' ? parseInt(age) : age,
        tel,
        gender,
        enabled: true,
        role: 'user',
        imgId: null,
        score: 36.5
    };

    if (thumbnails.length > 0) {
        try {
            const imgIds = await uploadThumbnailApi(thumbnails);
            user.imgId = imgIds.length > 0 ? imgIds[0].toString() : null;
        } catch (error) {
            console.error('Thumbnail upload failed:', error);
        }
    }

    return await registerUser(user,thumbnails);
};


// 사용자 로그인 서비스
export const authenticateUser = async (username: string, password: string): Promise<string> => {
    return await loginUser(username, password);
};


