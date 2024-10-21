export interface NoticeModel {
  id: number;  
  title: string;
  content: string;
  date: string;
  hits: number;
}

export const initialNotice: NoticeModel = {
  id: 0,
  title: '',
  content: '',
  date: '',
  hits: 0
}

