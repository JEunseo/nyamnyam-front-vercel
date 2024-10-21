"use client";
import { useRef } from  'react'
import { Provider } from  'react-redux'
import { makeStore, AppStore } from  '../lib/store'

export  default  function  StoreProvider ( {
  children
}: {
  children: React.ReactNode
} ) {
  const storeRef = useRef< AppStore >()
  if (!storeRef. current ) {
    // 처음 렌더링할 때 스토어 인스턴스를 생성합니다.
     storeRef. current = makeStore ()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}