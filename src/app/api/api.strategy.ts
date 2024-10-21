import instance, { instance1 } from "./axios"

const getStrategy = async (url: string, params?: any) => {
    return await instance.get(url, { params });
};

const postStrategy = async (url: string, data: any) => {
    return await instance.post(url, data);
};

const postMultipartStrategy = async (url: string, formData: FormData) => {
    return await instance.post(url, formData);
}

const postWithParamsStrategy = async (url: string, params?: any, data: any = {}) => {
    return await instance.post(url, data, { params });
};

const putStrategy = async (url: string, data: any) => {
    return await instance.put(url, data);
};

const putMultipartStrategy = async (url: string, formData: FormData) => {
    return await instance.put(url, formData);
}

const deleteStrategy = async (url: string) => {
    return await instance.delete(url);
};

const deleteWithParamStrategy = async (url: string, params?: any) => {
    return await instance.delete(url, { params });
};

const getStrategy1 = async (url: string, params?: any) => {
    return await instance1.get(url, { params });
};

const postStrategy1 = async (url: string, data: any) => {
    return await instance1.post(url, data);
};

const postWithParamsStrategy1 = async (url: string, params?: any, data: any = {}) => {
    return await instance1.post(url, data, { params });
};

const putStrategy1 = async (url: string, data: any) => {
    return await instance1.put(url, data);
};

const deleteStrategy1 = async (url: string) => {
    return await instance1.delete(url);
};

export const strategy = {
    GET: getStrategy,
    POST: postStrategy,
    POST_MULTIPART: postMultipartStrategy,
    POST_PARAMS: postWithParamsStrategy,
    PUT: putStrategy,
    PUT_MULTIPART: putMultipartStrategy,
    DELETE: deleteStrategy,
    DELETE_PARAMS: deleteWithParamStrategy
};
export const strategy1 = {
    GET: getStrategy1,
    POST: postStrategy1,
    POST_PARAMS: postWithParamsStrategy1,
    PUT: putStrategy1,
    DELETE: deleteStrategy1,
};