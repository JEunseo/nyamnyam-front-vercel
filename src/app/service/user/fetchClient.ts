export const customFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

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
