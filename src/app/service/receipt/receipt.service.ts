import {receipt} from "src/app/api/receipt/receipt.api";
import {CountCost} from "src/app/model/dash.model";
import {ReceiptModel} from "@/app/model/receipt.model";


export const fetchReceiptRegister = async (formData: FormData, id: string): Promise<any> => {
    const data = await receipt.receiptRegister(formData, id);
    return data;
};

export const fetchReceiptCost = async (id : string) : Promise<CountCost[]>  => {
    const data = await receipt.receiptCost(id);
    return data;
}

export const fetchReceiptWallet = async (id: string): Promise<ReceiptModel[]> => {
    const data = await receipt.receiptWallet(id);
    return data.map((item: ReceiptModel) => ({
        ...item,
        date: item.date ? item.date.slice(0, 10).trim() : '',
    }));
};
