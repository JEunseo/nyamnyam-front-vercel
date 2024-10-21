"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { getRestaurantsByTag } from '@/app/service/restaurant/restaurant.service';
import ScrollToTop from '@/app/components/ScrollToTop';
import Product from '@/app/components/Product';
import Link from 'next/link';
import nookies from 'nookies';
import { fetchRestaurantOne } from '@/app/service/admin/admin.service';
import Modal from "@/app/components/Modal";

interface Props {
    start: number;
    limit: number;
}

const TabFeatures: React.FC<Partial<Props>> = ({ start, limit }) => {
    const [restaurantsByMeeting, setRestaurantsByMeeting] = useState<RestaurantModel[]>([]);
    const [restaurantsByDate, setRestaurantsByDate] = useState<RestaurantModel[]>([]);
    const [restaurantsByFriend, setRestaurantsByFriend] = useState<RestaurantModel[]>([]);
    const [restaurantsByUnique, setRestaurantsByUnique] = useState<RestaurantModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalRestaurant, setModalRestaurant] = useState<RestaurantModel | null>(null);


    const cookies = nookies.get();
    const userId = cookies.userId;

    useEffect(() => {
        if (userId !== undefined) {
            const loadRestaurant = async () => {
                try {
                    const restaurantData = await fetchRestaurantOne(userId);
                    setModalRestaurant(restaurantData);
                    setIsModalOpen(true);
                } catch (error) {
                    setIsModalOpen(false);
                }
            }

            loadRestaurant();
        }
    }, []);

    

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const meetingData = await getRestaurantsByTag(['회식']);
                setRestaurantsByMeeting(meetingData);

                const dateData = await getRestaurantsByTag(['데이트']);
                setRestaurantsByDate(dateData);

                const withFriendData = await getRestaurantsByTag(['친구 모임']);
                setRestaurantsByFriend(withFriendData);

                const uniqueData = await getRestaurantsByTag(['유니크함']);
                setRestaurantsByUnique(uniqueData);
            } catch (error) {
                console.error('Error fetching restaurants by tag:', error);
            }
        };
        fetchRestaurants();
    }, []);

    const renderSwiper = (title: string, restaurants: RestaurantModel[], index: number) => {
        const restaurantCount = restaurants.length; // 슬라이드 수 계산

        return (
            <div className="container mb-10" key={index}>
                <div className="heading flex flex-col items-start text-left">
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                </div>
                <div className="relative list-product hide-product-sold section-swiper-navigation style-outline style-border md:mt-6 mt-4">
                    <Swiper
                        spaceBetween={12}
                        slidesPerView={2}
                        navigation={{ nextEl: `.swiper-button-next-${index}`, prevEl: `.swiper-button-prev-${index}` }}
                        loop={restaurantCount >= 4} // 슬라이드 수가 6 이상일 때 루프 활성화
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                                spaceBetween: 12,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1200: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {restaurants.slice(start, limit).map((restaurant) => (
                            <SwiperSlide key={restaurant.id}>
                                {/* <Link href={`/restaurant/${restaurant.id}`}> */}
                                    <Product data={restaurant} type='grid' />
                                {/* </Link> */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={`swiper-button-next swiper-button-next-${index}`} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: 10 }} />
                    <div className={`swiper-button-prev swiper-button-prev-${index}`} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', zIndex: 10 }} />
                </div>
            </div>
        );
    };

    return (
        <>
            {/* <ScrollToTop /> */}
            <div className="tab-features-block md:pt-20 pt-10">
                {renderSwiper('#회식', restaurantsByMeeting, 0)}
                {renderSwiper('#유니크', restaurantsByUnique, 1)}
                {renderSwiper('#데이트, #기념일', restaurantsByDate, 2)}
                {renderSwiper('#친구 모임', restaurantsByFriend, 3)}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalRestaurant !== null ? (
                    <div className={"text-center"}>
                        <h5></h5>
                        <h1>오늘 이 음식점 어때요?</h1>
                        <h2 className="text-xl font-bold">{modalRestaurant.name}</h2>

                        <img
                            src={modalRestaurant.thumbnailImageUrl || '/default-thumbnail.jpg'}
                            alt={modalRestaurant.name}
                            className="w-full h-48 object-cover"
                        />
                        <p className="mt-2">주소: {modalRestaurant.address}</p>
                        <p className="mt-2">전화번호: {modalRestaurant.tel}</p>
                        <p className="mt-2">유형: {modalRestaurant.type}</p>
                        <Link href={`/restaurant/${modalRestaurant.id}`}>
                            <button className="mt-4 bg-orange-400 text-white py-2 px-4 rounded">음식점으로
                                이동
                            </button>
                        </Link>

                    </div>

                ) : (
                    <p>로딩 중...</p>
                )}
            </Modal>
        </>
    );
};

export default TabFeatures;