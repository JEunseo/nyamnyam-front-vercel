import instance from "../axios";
import {api} from "../request";
import {OpinionModel} from "src/app/model/opinion.model";
import {strategy} from "src/app/api/api.strategy";


const insertOpinion = async (opinion: OpinionModel): Promise<OpinionModel> => {
    try {
        const resp = await strategy.POST(`${api.opinion}`, opinion)
        return resp.data;

    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }
}

const opinionAll = async () => {
    try {
        const resp = await strategy.GET(`${api.opinion}`)
        return resp.data;
    } catch (error) {
        console.error("Failed to register notice:", error);
        throw new Error("Failed to register notice");
    }
}

export const opinion = {insertOpinion, opinionAll}



