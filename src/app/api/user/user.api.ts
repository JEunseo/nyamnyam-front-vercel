import { User } from "src/app/model/user.model";
let token: string | null = null;

if (typeof window !== "undefined") {
    token = localStorage.getItem('token');
}

export const fetchUserExists = async (id: string): Promise<boolean> => {
    const response = await fetch(`http://localhost:8080/api/user/existsById?id=${id}`,{
        method: "GET",
        headers: {
            'Authorization': token ? `Bearer ${token}` : '', // JWT 토큰을 Bearer 형식으로 추가
            "Content-Type": "application/json",
        },});
    if (!response.ok) {
        throw new Error('Failed to fetch user existence');
    }
    return response.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/user/findById?id=${id}`,{
        method: "GET",
        headers: {
            'Authorization': token ? `Bearer ${token}` : '', // JWT 토큰을 Bearer 형식으로 추가
            "Content-Type": "application/json",
        },});
    if (!response.ok) {
        throw new Error('Failed to fetch user by ID');
    }
    return response.json();
};

export const fetchAllUsers = async (): Promise<User[]> => {
    const response = await fetch(`http://localhost:8080/api/user/findAll`,{
        method: "GET",
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch all users');
    }
    return response.json();
};

export const fetchUserCount = async (): Promise<number> => {
    const response = await fetch(`http://localhost:8080/api/user/count`);
    if (!response.ok) {
        throw new Error('Failed to fetch user count');
    }
    return response.json();
};

export const deleteUserById = async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/user/deleteById?id=${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
};

export const updateUser = async (user: User): Promise<User> => {
    const response = await fetch(`http://localhost:8080/api/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};

export const registerUser = async (user: User, thumbnails: File[]): Promise<User> => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

    thumbnails.forEach((thumbnail, index) => {
        formData.append(`thumbnails`, thumbnail);
    });

    const response = await fetch(`http://localhost:8080/api/user/join`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }
    return response.json();
};



export const loginUser = async (username: string, password: string): Promise<string> => {
    const response = await fetch(`http://localhost:8080/api/user/login?username=${username}&password=${password}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }


    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.token;
    } else {
        return response.text();
    }
};
export const uploadThumbnailApi = async (thumbnails: File[]): Promise<number[]> => {
    const formData = new FormData();
    thumbnails.forEach(thumbnail => {
        formData.append('images', thumbnail);
    });

    const response = await fetch('http://localhost:8080/api/thumbnails/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload thumbnails');
    }

    const data = await response.json();
    return data.imgIds;
};



