// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import postSlice from './features/post.slice';
import replySlice from './features/reply.slice';
import noticeSlice from './features/notice.slice';
import receiptSlice from "src/lib/features/receipt.slice"; // 경로 수정

export const makeStore = () => {
  return configureStore({
    reducer: {
      post: postSlice,
      reply: replySlice,
      notice: noticeSlice,
      receipt: receiptSlice,
    },
  });
};

// 스토어 생성
export const store = makeStore();

// 스토어 타입 유추
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
