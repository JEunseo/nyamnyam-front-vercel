import {api} from "src/app/api/request";
import {strategy} from "src/app/api/api.strategy";
import {CountCost} from "src/app/model/dash.model";
import {ReceiptModel} from "@/app/model/receipt.model";


const receiptRegister = async (formData: FormData, id: string): Promise<any> => {
    try {
        const resp = await strategy.POST(`${api.receipt}/insert/${id}`, formData);
        return resp.data;
    } catch (error) {
        console.error("Failed to register receipt:", error);
        throw new Error("Failed to register receipt");
    }
};

const receiptCost = async (id: string) :Promise<CountCost[]> => {
    try {
        const resp = await strategy.GET(`${api.receipt}/wallet/cost/${id}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to register receipt:", error);
        throw new Error("Failed");
    }
}

const receiptWallet = async (id: string) :Promise<ReceiptModel[]> => {
    try {
        const resp = await strategy.GET(`${api.receipt}/wallet/${id}`);
        return resp.data;
    } catch (error) {
        console.error("Failed to register receipt:", error);
        throw new Error("Failed");
    }
}





export const receipt = {receiptRegister, receiptCost, receiptWallet}