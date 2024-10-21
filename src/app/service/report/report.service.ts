import {notice} from "src/app/api/notice/notice.api";
import {ReportModel} from "src/app/model/report.model";
import {report} from "src/app/api/report/report.api";
import {ReportCountModel} from "@/app/model/dash.model";

export const fetchReportList = async () => {
    const data: ReportModel[] = await report.reportAll();
    const sortedData = data.sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
    return sortedData;
};

export const fetchReportRegister = async (reportModel: ReportModel) => {
    try {
        const data = await report.reportRegister(reportModel);

        return data;
    } catch (error) {
        console.error("Failed to create notice:", error);
        throw error;
    }

}

export const fetchReportCountAll = async () => {
    const data: ReportCountModel[] = await report.reportCountAll();
    return data;
}