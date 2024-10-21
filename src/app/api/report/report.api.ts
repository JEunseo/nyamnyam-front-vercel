import {strategy} from "src/app/api/api.strategy";
import {api} from "src/app/api/request";
import {ReportModel} from "src/app/model/report.model";

const reportAll = async () => {
    try {
        const response = await strategy.GET(`${api.report}`);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch group details");
        throw new Error("Failed to fetch notice details");
    }
};

const reportRegister = async (report: ReportModel): Promise<ReportModel[]> => {
    try {
        const response = await strategy.POST(`${api.report}/save`, report);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch group details");
        throw new Error("Failed to fetch notice details");
    }
}

const reportCountAll = async () => {
    try {
        const response = await strategy.GET(`${api.report}/reportAll`);
        return response.data;
    }
    catch (error) {
        console.error("Failed to fetch group details");
        throw new Error("Failed to fetch notice details");
    }
}



export const report = {reportAll, reportRegister, reportCountAll}