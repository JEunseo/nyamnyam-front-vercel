"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchReceiptRegister } from "src/app/service/receipt/receipt.service";
import nookies from "nookies";
import Modal from "@/app/components/Modal";
import ShowRestaurant from "@/app/(page)/receipt/receiptRestaurant/[restaurantId]/page";

export default function InsertReceipt() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const cookies = nookies.get();
    const id = cookies.userId;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.size > 10 * 1024 * 1024) { // 10MB
                setAlertMessage('파일 크기가 10MB를 초과할 수 없습니다.');
                setAlertOpen(true);
                setSelectedFile(null);
                setPreview(null);
                return;
            }
            setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreview(fileReader.result as string);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const sendReceipt = async () => {
        if (selectedFile && !isUploading) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const resp = await fetchReceiptRegister(formData, id);
                console.log(resp);

                const receivedRestaurantId = resp.id;

                if (receivedRestaurantId == null) {
                    setAlertMessage("이미 등록된 정보입니다");
                    setAlertOpen(true);
                } else {
                    setRestaurantId(receivedRestaurantId);
                    setModalOpen(true);
                }

            } catch (error) {
                setAlertMessage("형식에 맞지 않는 영수증입니다");
                setAlertOpen(true);
                console.error('파일 업로드 오류:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="profile-block py-10 mt-10">
            <div className="container rounded-lg shadow-lg p-6 bg-white"
                 style={{ border: '2px dashed #FFA500', padding: '16px' }}>
                <h4 className="text-center text-orange-700 font-semibold mb-4">
                    직접 방문한 장소 영수증의 결제 정보가 잘 나오게 사진을 찍어 올려주세요
                </h4>
                <div className="content-main flex flex-col md:flex-row gap-8 w-full">
                    <div className="left md:w-2/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px] flex justify-center items-center">
                        <img
                            src="/images/save.jpg"
                            alt="사진 첨부"
                            onClick={handleImageClick}
                            style={{ cursor: 'pointer' }}
                            width={300}
                            height={300}
                        />
                        <input
                            ref={fileInputRef}
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="right w-full">
                        {preview && (
                            <div className="flex flex-col items-center">
                                <h3 className="font-semibold mb-2">영수증 미리보기</h3>
                                <img src={preview} alt="미리보기" className="rounded-lg shadow-md mb-2"
                                     style={{ width: '200px', height: 'auto' }} />
                                <button
                                    type="submit"
                                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 shadow-lg"
                                    onClick={sendReceipt}
                                    disabled={isUploading}
                                >
                                    사진 첨부
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {restaurantId && <ShowRestaurant restaurantId={restaurantId} />}
            </Modal>
            <Modal isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
                <div className="p-4 text-center mt-5">
                    <h3 className="font-semibold text-lg">{alertMessage}</h3>
                    <button
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200"
                        onClick={() => setAlertOpen(false)}
                    >
                        닫기
                    </button>
                </div>
            </Modal>
        </div>
    );
}
