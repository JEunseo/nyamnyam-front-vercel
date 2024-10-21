'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearchContext } from 'src/app/components/SearchContext';
import { getRestaurantDetails } from 'src/app/service/restaurant/restaurant.service';
import Star from '../../../components/Star';
import PostList from '../../post/[restaurantId]/page';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image'



export default function Restaurant() {
    const { id } = useParams<{ id: string }>();
    const restaurantId = id ? Number(id) : null;
    const [restaurant, setRestaurant] = useState<RestaurantModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [openPopupImg, setOpenPopupImg] = useState(false);

    const { searchTerm } = useSearchContext();
    const router = useRouter();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { restaurants } = await getRestaurantDetails(Number(id));
                setRestaurant(restaurants);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        if (restaurant && restaurant.address) {
            const mapScript = document.createElement('script');
            mapScript.async = true;
            mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
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

                        geocoder.addressSearch(restaurant.address, function (result: any, status: any) {
                            if (status === window.kakao.maps.services.Status.OK) {
                                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                                const marker = new window.kakao.maps.Marker({
                                    map: map,
                                    position: coords,
                                });
                                const infowindow = new window.kakao.maps.InfoWindow({
                                    content: `<div style="width:100%;padding:6px 0;">${restaurant.name}</div>`,
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
    }, [restaurant]);

    useEffect(() => {
        if (searchTerm && !isInitialLoad) {
            router.push(`/?search=${searchTerm}`);
        }
    }, [searchTerm]);



    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (!restaurant) return <div className="text-center py-4">Restaurant not found.</div>;

    const renderMenu = (menu: string) => {
        const menuItems = menu.split(/(?<=\d원),/).map(item => item.trim()).filter(item => item.length > 0);
        return (
            <div className="space-y-2">
                {menuItems.map((item, index) => {
                    const [name, price] = item.split('-').map(part => part.trim());
                    return (
                        <div key={index} className="flex justify-between">
                            <span className="text-gray-800 text-lg">{name}</span>
                            <span className="text-gray-600 text-lg">{price}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderOperTime = (operTime: string) => {
        const timeItems = operTime.match(/(월|화|수|목|금|토|일|매일)\s*\/\s*\d{2}:\d{2}.*?(?=\s*(월|화|수|목|금|토|일|매일|$))/g);

        return (
            <ul className="list-disc pl-5 space-y-2">
                {timeItems?.map((item, index) => {
                    const [day, hours] = item.split(' / ');
                    return (
                        <li key={index} className="flex text-lg">
                            <strong className="text-gray-800">{day.trim()}</strong> / {hours ? hours.trim() : '운영시간 정보 없음'}
                        </li>
                    );
                })}
            </ul>
        );
    };



    return (
            <div className="container mx-auto px-4 py-4 bg-white shadow-lg rounded-lg">
                <div className="product-detail default">
                    <div className="featured-product md:py-20 py-10">
                        <div className="container flex flex-col md:flex-row justify-between gap-y-6">
                            <div className="list-img md:w-1/2 md:pr-[45px] w-full overflow-hidden">
                                <Swiper
                                    modules={[Thumbs, Autoplay]}
                                    autoplay={{delay: 2000, disableOnInteraction: false}}
                                    className="mySwiper2 rounded-2xl overflow-hidden"
                                >
                                    <SwiperSlide onClick={() => setOpenPopupImg(true)} className="overflow-hidden">
                                        <Image
                                            src={restaurant.thumbnailImageUrl || '/default-image.jpg'}
                                            width={800}
                                            height={800}
                                            alt={restaurant.name}
                                            className="w-full aspect-[3/4] object-cover"
                                        />
                                    </SwiperSlide>
                                    <SwiperSlide className="overflow-hidden">
                                        <Image
                                            src={restaurant.subImageUrl || '/default-image.jpg'}
                                            width={800}
                                            height={800}
                                            alt={restaurant.name}
                                            className="w-full aspect-[3/4] object-cover"
                                        />
                                    </SwiperSlide>
                                </Swiper>

                            </div>
                            <div className="product-infor md:w-1/2 w-full lg:pl-[15px] md:pl-2">
                                <div className="caption2 text-secondary font-semibold uppercase">{restaurant.type}</div>
                                <div className="heading4 mt-1">
                                    {restaurant.name}
                                </div>
                                <div className='desc text-secondary mt-3'>
                                전화번호: {restaurant.tel}
                                </div>
                                <div className="flex items-center mt-2">
                                    <br></br>
                                    {restaurant.rate != null && restaurant.rate !== 0 ? (
                                        <div className="flex items-center">
                                            네이버 평점 <Star w="w-6" h="h-6" readonly={true} rate={restaurant.rate} onChange={() => { }} />
                                            <p className="ml-2">{restaurant.rate.toFixed(1)} / 5</p>
                                        </div>
                                    ) : '등록된 평점이 없습니다'}
                                </div>
                                <br></br>

                                <div className="mt-4">
                                    <strong className="text-lg">메뉴</strong>
                                    <div>{renderMenu(restaurant.menu)}</div>
                                </div>

                                <br></br>
                                <div className="mt-4">
                                    <strong className="text-lg">운영시간</strong>
                                    <div>{renderOperTime(restaurant.operation)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-96 rounded-lg shadow-md mt-6">
                            <div id="map" className="w-full h-full rounded-lg"></div>
                        </div>
                        <div style={{ borderTop: '1px solid #e0e0e0' }} className='my-30'>
                            <PostList restaurantId={restaurantId} />
                        </div>
                    </div>
            </div>
        </div>
    );
};

