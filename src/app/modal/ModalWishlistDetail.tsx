'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalWishlistContext } from '../context/ModalWishlistContext';
import { useWishlist } from '../context/WishlistContext';


interface ModalWishlistDetailProps {
    userId: string;
    wishlistId: number;
    wishlistName: string;
    closeDetails: () => void;
}

const ModalWishlistDetail: React.FC<ModalWishlistDetailProps> = ({ userId, wishlistId, wishlistName, closeDetails }) => {
  


    const { isModalOpen } = useModalWishlistContext();
    const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);


    useEffect(() => {
        const fetchRestaurants = async () => {
            const response = await fetch(`http://localhost:8080/api/wishList/restaurants?wishListId=${wishlistId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },
            });

            if (response.ok) {
                const restaurantData = await response.json();
                setRestaurants(restaurantData);
            } else {
                const errorText = await response.text();
                console.error(errorText);
            }
        };

        if (isModalOpen && wishlistId) {
            fetchRestaurants();
        }
    }, [isModalOpen, userId, wishlistId]);

    if (!isModalOpen) return null;



    return (
        <>
            <div className={`modal-wishlist-block`} onClick={closeDetails}>
                <div
                    className={`modal-wishlist-main py-6 ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="heading px-6 pb-3 flex items-center justify-between relative">
                        <div className="heading5">{wishlistName}</div>
                        <div
                            className="close-btn absolute right-6 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                            onClick={closeDetails}
                        >
                            <Icon.X size={14} />
                        </div>
                    </div>
                    <div className="list-product px-6 grid grid-cols-2 gap-4">
                        {restaurants.map((restaurant, index) => (
                            <div
                                key={index}
                                className='item flex flex-col items-center justify-center border-b cursor-pointer'
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    margin: '5px',
                                    textAlign: 'center'
                                }}
                            >
                                <Link href={`/restaurant/${restaurant.id}`}>
                                    <div onClick={closeDetails} style={{ textDecoration: 'none', color: 'black', width: '100%', height: '100%' }}>
                                        <img src={restaurant.thumbnailImageUrl} alt={restaurant.name} style={{ borderRadius: '8px', width: '100%', height: 'auto' }} />
                                        <div
                                            className="name text-button"
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: '300',
                                                color: 'black',
                                            }}
                                        >
                                            {restaurant.name}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="footer-modal p-6 border-t bg-white border-line absolute bottom-0 left-0 w-full text-center">
                        <div onClick={closeDetails} className="text-button-uppercase mt-4 text-center has-line-before cursor-pointer inline-block">Or continue</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalWishlistDetail