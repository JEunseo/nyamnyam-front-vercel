export interface ImageModel {
    id: number;
    originalFilename: string;
    storedFileName : string;
    extension: string;
    uploadURL: string;
    postId: number;
}

export const initialImage: ImageModel = {
    id: 0,
    originalFilename: '',
    storedFileName : '',
    extension: '',
    uploadURL: '',
    postId: 0
}