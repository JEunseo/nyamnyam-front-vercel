import { createSlice, PayloadAction } from  '@reduxjs/toolkit' 
import  type { RootState } from  '../store'
import { initialPost, PostModel } from 'src/app/model/post.model'


const postSlice = createSlice({
  name: 'post',
  initialState:  initialPost,
  reducers : {
    savePost: (state, action:PayloadAction<PostModel>)=> {
      return action.payload
    },
    clearPost:(state) => {
      return initialPost
    }
  },
  extraReducers: (builder)=> {} 
  }) 

export const getPost = (state: RootState) => state.post

export  const { savePost,clearPost } = postSlice. actions 
  
export default  postSlice.reducer