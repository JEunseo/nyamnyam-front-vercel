import {opinion} from "src/app/api/opinion/opinion.api";
import {OpinionModel} from "src/app/model/opinion.model";

export const fetchInsertOpinion = async (opinionModel: OpinionModel): Promise<OpinionModel> => {
    try {
        const data = await opinion.insertOpinion(opinionModel);

        return data;
    } catch (error) {
        console.error("Failed to create notice:", error);
        throw error; // 에러 발생 시 예외 던지기
    }
}


export const fetchShowOpinion = async () => {
        const data: OpinionModel[] = await opinion.opinionAll();
        return data;
}
