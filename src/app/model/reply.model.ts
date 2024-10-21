//src/app/model/reply.model.ts
export interface ReplyModel{
    id:number;
    content:string;
    postId: number;
    userId: string;
    nickname: string;
    entryDate: string;
    modifyDate?: string;
}

export const initialReply: ReplyModel = {
    id: 0,
    content: '',
    postId: 0,
    userId: '',
    nickname: '',
    entryDate: '',
    modifyDate: '',
}