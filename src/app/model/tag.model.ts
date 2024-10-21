export interface TagModel{
    name:string;
    tagCategory:string ;
    postTags: PostTagModel[];
}

export const initialTag: TagModel = {
    name: '',
    tagCategory: '',
    postTags: [],
}