import { createSlice, PayloadAction } from  '@reduxjs/toolkit'
import  type { RootState } from  '../store'
import { initialReceipt, ReceiptModel } from 'src/app/model/receipt.model'


const receiptSlice = createSlice ({ //자바의 POJO이다
    name : 'receipt' ,
    // `createSlice`는 `initialState` 인수에서 상태 유형을 유추합니다.
    initialState: initialReceipt,
    reducers : {
        saveReceipt: (state, action:PayloadAction<ReceiptModel>)=> {
            return action.payload
        },
        clearReceipt:(state) => {
            return initialReceipt
        }
    },
    extraReducers: (builder)=> {}
})

export const getReceipt = (state: RootState) => state.receipt

export  const { saveReceipt,clearReceipt } = receiptSlice.actions

// 선택자와 같은 다른 코드는 가져온 `RootState` 유형을 사용할 수 있습니다
export  default  receiptSlice.reducer