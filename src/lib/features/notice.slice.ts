import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {NoticeModel } from 'src/app/model/notice.model';

export const initialNotice: NoticeModel[] = [];

const noticeSlice = createSlice({
    name: 'notice',
    initialState: initialNotice, // 초기 상태를 빈 배열로 설정
    reducers: {
        saveNotice: (state, action: PayloadAction<NoticeModel>) => {
            state.push(action.payload); // 새로운 공지사항을 배열에 추가
        },
        clearNotice: () => {
            return initialNotice; // 초기 상태로 리셋
        },
    },
    extraReducers: (builder) => {},
});

// 선택자
export const getNotice = (state: RootState) => state.notice;

// 액션 내보내기
export const { saveNotice, clearNotice } = noticeSlice.actions;

// 배열로 공지사항 선택하기
export const selectNotices = (state: RootState) => state.notice;

export default noticeSlice.reducer;