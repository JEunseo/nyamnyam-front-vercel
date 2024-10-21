"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { restaurant } from "@/app/api/restaurant/restaurant.api";

interface ShowRestaurantProps {
    restaurantId: number;
}

const ShowRestaurant: React.FC<Partial<ShowRestaurantProps>> = ({ restaurantId }) => {
    const [restaurantModel, setRestaurantModel] = useState<RestaurantModel | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await restaurant.fetchRestaurantById(restaurantId);
                setRestaurantModel(data);
            } catch (error) {
                console.error('Error fetching restaurant:', error);
            }
        };

        if (restaurantId) {
            fetchData();
        }
    }, [restaurantId]);

    useEffect(() => {
        if (restaurantModel && restaurantModel.address) {
            const mapScript = document.createElement('script');
            mapScript.async = true;
            mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&autoload=false&libraries=services`;
            document.head.appendChild(mapScript);

            const onLoadKakaoMap = () => {
                (window as any).kakao.maps.load(() => {
                    const mapContainer = document.getElementById('map');
                    if (mapContainer) {
                        const mapOption = {
                            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                            level: 3,
                        };
                        const map = new kakao.maps.Map(mapContainer, mapOption);
                        const geocoder = new (window as any).kakao.maps.services.Geocoder();

                        geocoder.addressSearch(restaurantModel.address, function (result: any, status: any) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                                const marker = new window.kakao.maps.Marker({
                                    map: map,
                                    position: coords,
                                });

                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: `<div style="width:150px;text-align:center;padding:6px 0;">${restaurantModel.name}</div>`,
                                });
                                infowindow.open(map, marker);
                                map.setCenter(coords);
                            } else {
                                console.error("주소 검색 실패:", status);
                            }
                        });
                    } else {
                        console.error("지도 컨테이너가 존재하지 않습니다.");
                    }
                });
            };

            mapScript.addEventListener('load', onLoadKakaoMap);
        }
    }, [restaurantModel]);

    if (!restaurantModel) return <div>Restaurant not found.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">{restaurantModel.name}</h1>
            <div className="flex justify-between mb-4">
                <img
                    src={restaurantModel.thumbnailImageUrl || '/default-thumbnail.jpg'}
                    alt={restaurantModel.name}
                    className="w-1/2 h-48 object-cover"
                />
                {restaurantModel.subImageUrl && (
                    <img
                        src={restaurantModel.subImageUrl || '/default-subimage.jpg'}
                        alt={restaurantModel.name}
                        className="w-1/2 h-48 object-cover"
                    />
                )}
            </div>
            <p><strong>유형:</strong> {restaurantModel.type}</p>
            <p><strong>주소:</strong> {restaurantModel.address}</p>
            <p><strong>전화번호:</strong> {restaurantModel.tel}</p>
            <div>
                <h3>이용하신 음식점의 정보가 맞나요?</h3>
                <button
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2"
                    onClick={() => {
                        if (restaurantId) {
                            router.push(`/post/register/${restaurantId}`);
                        } else {
                            console.error("Restaurant ID is not available");
                        }
                    }}>
                    포스트 등록하기
                </button>
            </div>
        </div>
    );
}

export default ShowRestaurant;
