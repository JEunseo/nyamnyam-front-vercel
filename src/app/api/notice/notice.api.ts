import {api} from "../request";
import {NoticeModel} from "src/app/model/notice.model";
import {strategy} from "src/app/api/api.strategy";


const noticeAll = async () => {
    try {
    const response = await strategy.GET(`${api.notice}`);
    return response.data;
    }
    catch (error) {
        console.error("Failed to fetch group details");
        throw new Error("Failed to fetch notice details");
    }
};



const showNotice = async (id: number): Promise<NoticeModel> => {
    try {
        const response = await strategy.GET(`${api.notice}/${id}`);
        return response.data; // 데이터 반환
    } catch (error) {
        console.error("Failed to fetch notice details:", error);
        throw new Error("Failed to fetch notice details");
    }
}

const noticeRegister = async (notice: NoticeModel): Promise<NoticeModel> => {
    try {
        const resp = await strategy.POST(`${api.notice}`, notice);
        return resp.data;
    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }
};

const updateNotice = async (notice: NoticeModel) => {
    try {
        const resp = await strategy.PUT(`${api.notice}`, notice);
        return resp.data;
    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }

}

const deleteNotice = async (id :number) => {
    try {
        const resp = await strategy.DELETE(`${api.notice}/${id}`)
    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }

}

export const notice = {noticeAll, showNotice, noticeRegister, updateNotice, deleteNotice}


