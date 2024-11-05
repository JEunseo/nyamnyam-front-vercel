export const customFetch = async (url: string, options: RequestInit = {}) => {
    //const token = localStorage.getItem('token');
    let token: string | null = null;

if (typeof window !== "undefined") {
    // 브라우저 환경에서만 localStorage 접근
    token = localStorage.getItem('token');
}

    const defaultHeaders = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const modifiedOptions: RequestInit = {
        ...options,
        headers: defaultHeaders,
    };

    const response = await fetch(url, modifiedOptions);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Request failed');
    }

    const contentType = response.headers.get('Content-Type');


    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
};
