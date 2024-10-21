import {notice} from 'src/app/api/notice/notice.api';
import {NoticeModel} from "src/app/model/notice.model";
import {number} from "prop-types";
import instance from "src/app/api/axios";

export const fetchNoticeList = async () => {
   const data: NoticeModel[] = await notice.noticeAll();
   return data.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
   });
};

export const fetchNoticeOne = async (id: number): Promise<NoticeModel> => {
   const data: NoticeModel = await notice.showNotice(id);
   return data;
}

export const fetchNoticeRegister = async (noticemodel: NoticeModel): Promise<NoticeModel> => {
   try {
      const data = await notice.noticeRegister(noticemodel);

      return data;
   } catch (error) {
      console.error("Failed to create notice:", error);
      throw error;
   }
};

export const fetchNoticeUpdate = async (noticemodel : NoticeModel): Promise<NoticeModel> => {
   try {
      const data = await notice.updateNotice(noticemodel);

      return data;
   } catch (error) {
      console.error("Failed to create notice:", error);
      throw error;
   }
}

export const fetchDeleteNotice = async (id : number) => {
   try {
      const data = await notice.deleteNotice(id);

      return data;
   } catch (error) {
      console.error("Failed to create notice:", error);
      throw error;
   }
}






