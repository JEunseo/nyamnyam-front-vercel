'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalWishlistContext } from '../context/ModalWishlistContext';
import { useWishlist } from '../context/WishlistContext';
import ModalWishlistDetail from './ModalWishlistDetail';
import nookies from 'nookies';


const pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFABAB', '#FFC3A0', '#FF677D',
    '#D4A5A5', '#392F5A', '#F7B7A3', '#D5AAFF', '#A9DEF9'
];


const ModalWishlist = () => {
    const cookies = nookies.get();
    const userId = cookies.userId;


    const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
    // const { wishlistState, removeFromWishlist } = useWishlist()
    const [wishList, setWishList] = useState<WishListModel[]>([]);
    const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(null);
    const [selectedWishlistName, setSelectedWishlistName] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState(false);


    useEffect(() => {
        const fetchWishlist = async () => {
            const response = await fetch(`http://localhost:8080/api/wishList`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },
            });

            if (response.ok) {
                const wishListData = await response.json();
                setWishList(wishListData);
            }
        };

        if (isModalOpen) {
            fetchWishlist();
        }
    }, [isModalOpen]);


    const removeFromWishlist = async (wishlist: WishListModel) => {
        const response = await fetch(`http://localhost:8080/api/wishList/delete/wishList?id=${wishlist.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId.toString(),
            },
        });

        if (response.ok) {
            setWishList(prevItems => prevItems.filter(item => item.id !== wishlist.id));
        } else {
            console.error('Failed to delete item from wishlist');
        }
    };

    const openDetailsModal = (wishlistId: number, wishlistName: string) => {
        setSelectedWishlistId(wishlistId);
        setSelectedWishlistName(wishlistName);
        setShowDetail(true); // 디테일 모달 열기
    };

    const closeDetailsModal = () => {
        setShowDetail(false); // 디테일 모달 닫기
        setSelectedWishlistId(null);
        setSelectedWishlistName(null);
    };


    return (
        <>
            <div className={`modal-wishlist-block`} onClick={closeModalWishlist}>
                <div
                    className={`modal-wishlist-main py-6 ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="heading px-6 pb-3 flex items-center justify-between relative">
                        <div className="heading5">Wishlist</div>
                        <div
                            className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                            onClick={closeModalWishlist}
                        >
                            <Icon.X size={14} />
                        </div>
                    </div>
                    {showDetail ? (
                        <ModalWishlistDetail
                            userId={userId}
                            wishlistId={selectedWishlistId!}
                            wishlistName={selectedWishlistName!}
                            closeDetails={closeDetailsModal}
                        />
                    ) : (
                        <div className="list-product px-6 grid grid-cols-2 gap-4">
                            {wishList.map((wishlist, index) => (
                                <div
                                    key={index}
                                    className='item flex flex-col items-center justify-center border-b cursor-pointer'
                                    style={{
                                        backgroundColor: pastelColors[index % pastelColors.length],
                                        width: '100%', // Changed to '100%' to fill the column
                                        height: '200px',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div className="product-info cursor-pointer" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => openDetailsModal(wishlist.id, wishlist.name)}>
                                        <div className="name text-button" style={{ fontSize: '22px', fontWeight: 'bold' }}>{wishlist.name}</div>
                                    </div>
                                    <div className="remove-wishlist-btn text-red underline cursor-pointer" style={{ fontSize: '14px' }} onClick={() => removeFromWishlist(wishlist)}>
                                        Remove
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
                    <div className="footer-modal p-6 border-t bg-white border-line absolute bottom-0 left-0 w-full text-center">

                        <div onClick={closeModalWishlist} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Or continue shopping</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalWishlist