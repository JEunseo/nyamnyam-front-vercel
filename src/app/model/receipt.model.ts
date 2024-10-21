export interface ReceiptModel {
    id: number,
    price: number,
    name: string,
    menu: string,
    userId: number,
    date: string

}

export const initialReceipt: ReceiptModel = {
    id: 0,
    price: 0,
    name: '',
    menu: '',
    userId: 0,
    date: ''
}