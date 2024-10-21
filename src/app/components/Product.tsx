import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useModalWishlistContext } from '../context/ModalWishlistContext';
import { useWishlist } from '../context/WishlistContext';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import HeartButton from '../modal/AddHeart';

interface ProductProps {
    data: RestaurantModel;
    type: 'grid' | 'list';
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
    const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
    const { wishlistState } = useWishlist();
    const router = useRouter();

    const handleDetailProduct = (productId: string) => {
        // router.push(`/product/default?id=${productId}`);
        router.push(`/restaurant/${productId}`)
    };

    const isInWishlist = wishlistState.wishlistArray.some(item => item.id === data.id);


    
    return (
        <div className={`product-item ${type}-type`}>
            <div onClick={() => handleDetailProduct(data.id)} className={`product-main cursor-pointer ${type === 'list' ? 'flex lg:items-center' : 'block'}`}>
                 <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
                    {/*<div className="list-action-right absolute top-3 right-3 max-lg:hidden">
                        <div className={`add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 `} onClick={(e) => e.stopPropagation()}>
                            <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Add To Wishlist</div> */}
                            {/* {isInWishlist ? <Icon.Heart size={18} weight='fill' className='text-white' /> : <Icon.Heart size={18} />}  */}
                            {/* <HeartButton restaurantId={data.id} userId={1}/>  */}
               
                    <div className="product-img w-full h-full aspect-[3/4]">
                        <Image
                            src={data.thumbnailImageUrl} // 외부 이미지이기 때문에 next.config.mjs파일에 추가 필요
                            width={500}
                            height={500}
                            priority={true}
                            alt={data.name}
                            className='w-full h-full object-cover duration-700'
                        />
                    </div>
                </div>
                <div className="product-infor mt-4 lg:mb-7">
                    <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                        {data.name}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Product;