// src/app/api/reply/reply.api.ts

import { strategy } from "../api.strategy";
import { api } from "../request";

export const getById = async (postId: number) => {
    const response = await strategy.GET(`${api.reply}/post/${postId}`);
    return response.data;
};

export const insert = async (replyData: any) => {
    const response = await strategy.POST(api.reply, replyData)
    return response.data;
};

export const update= async (replyId: number, replyData: any) => {
    const response = await strategy.PUT(`${api.reply}/${replyId}`, replyData);
    return response.data;
};

export const remove = async (replyId: number) => {
    const response = await strategy.DELETE(`${api.reply}/${replyId}`);
    return response;
};

export const reply = {getById, insert, update, remove};


