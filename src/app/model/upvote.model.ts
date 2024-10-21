export interface UpvoteModel {
    id: number;
    giveId: string;
    haveId?: string;
    postId: number;
}

export const initialUpvote: UpvoteModel = {
    id: 0,
    giveId: '',
    haveId: '',
    postId: 0
}