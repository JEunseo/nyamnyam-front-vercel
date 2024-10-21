import { useState, useEffect } from 'react';
import Modal from '../components/Modal'; // Modal 컴포넌트 임포트
import { fetchWishListsService } from '../service/wishList/wishList.service';
import nookies from 'nookies';

interface HeartButtonProps {
    restaurantId: number | undefined;
    userId: number;
}

const HeartButton = ({ restaurantId }: HeartButtonProps) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [wishList, setWishList] = useState<WishListModel[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 추가 모달 상태
    const [newWishListName, setNewWishListName] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    // const userId = 1;
    const cookies = nookies.get();
    const userId = cookies.userId;

    useEffect(() => {

        const fetchFavoritedRestaurants = async () => {

            try {



                // 유저가 가지고 있는 모든 위시리스트의 모든 식당 가져와서 DB에 마운트된 전체 식당과 같은 아이디의 식당이 있으면 해당 식당은 하트 처리
                const response = await fetch(`http://localhost:8080/api/wishList/getAll`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId.toString(),
                    },
                });

                if (!response.ok) {
                    console.log('이미 추가한 레스토랑일 경우')
                }

                const favoritedRestaurants = await response.json();
                //console.log('Favorited Restaurants:', favoritedRestaurants);

                const isFavorited = favoritedRestaurants.includes(restaurantId);
                setIsFavorited(isFavorited);
            } catch (error) {
                console.error('Error fetching favorited restaurants:', error);
            }
        };

        fetchFavoritedRestaurants();
    }, [restaurantId]);

    // useEffect(() => {
    //     const fetchFavoritedRestaurants = async () => {
    //         try {
    //             const wishListData = await fetchWishListsService(userId); 
    //             const isFavorited = wishListData.data
    //             setIsFavorited(isFavorited);
    //         } catch (error) {
    //             console.error('Error fetching favorited restaurants:', error);
    //         }
    //     };

    //     fetchFavoritedRestaurants();
    // }, [restaurantId]);


    const handleToggleFavorite = async (event: React.MouseEvent) => {
        event.stopPropagation();
        const newFavoritedState = !isFavorited;
        //setIsFavorited(newFavoritedState);




        try {
            if (newFavoritedState) {
                const response = await fetch(`http://localhost:8080/api/wishList`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId.toString(),
                    },
                });

                if (!response.ok) {
                    console.log('즐겨찾기한 식당 없음')
                }

                const wishListData = await response.json();
                setWishList(wishListData);
                setIsModalOpen(true);
            }
            else {
                const deleteResponse = await fetch(`http://localhost:8080/api/wishList?restaurantId=${restaurantId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId.toString(),
                    },
                });

                if (!deleteResponse.ok) {
                    console.log('위시리스트에서 삭제 실패');
                } else {
                    console.log('식당이 위시리스트에서 삭제되었습니다.');
                    setIsFavorited(false);
                }
            }



        } catch (error) {
            console.error('Error fetching wish list:', error);
        }
    };




    const handleAddWishList = async () => {
        if (!newWishListName) return;

        try {
            const response = await fetch(`http://localhost:8080/api/wishList?name=${newWishListName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },

            });

            if (!response.ok) {
                throw new Error('위시리스트를 추가하는 데 실패했습니다.');
            }

            const newWishList = await response.json();
            setWishList((prev) => [...prev, newWishList]);
            setNewWishListName('');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding wish list:', error);
        }
    };

    const handleAddRestaurantToWishList = async (wishListId: number) => {
        if (!restaurantId) return;

        try {
            const response = await fetch(`http://localhost:8080/api/wishList/${wishListId}?restaurantId=${restaurantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },
            });

            if (!response.ok) {
                throw new Error('식당을 위시리스트에 추가하는 데 실패했습니다.');
            }

            const newRestaurant = await response.json();
            const addedWishListName = wishList.find(item => item.id === wishListId)?.name;
            console.log('식당이 추가되었습니다:', newRestaurant);
            setMessage(`식당이 ${addedWishListName} 에 추가되었습니다!`);

            setIsFavorited(true);

            setTimeout(() => {
                setMessage(null);
            }, 1000);

        } catch (error) {
            console.error('Error adding restaurant to wish list:', error);
            setMessage(`이미 추가된 식당입니다`);

            setTimeout(() => {
                setMessage(null);
            }, 1000);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleAddWishList();
        }
    };

    return (
        <>
            <button onClick={handleToggleFavorite} className="focus:outline-none">
                {isFavorited ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="red" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                )}
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">내 위시리스트</h2>
                <button onClick={() => setIsAddModalOpen(true)} className="text-blue-500">+ 새로 추가하기</button>
                {wishList.length === 0 ? (
                    <>
                    </>
                ) : (
                    <ul className="space-y-4">
                        {wishList.map((item) => (
                            <button key={item.id} onClick={() => handleAddRestaurantToWishList(item.id)} className="text-green-500">
                                <li className="flex justify-between items-center p-4 border rounded-lg shadow-sm" style={{ marginLeft: '10%' }}>
                                    <div>
                                        <h3 className="text-lg font-semibold">{item.name}   +</h3>
                                    </div>
                                </li>
                            </button>
                        ))}
                    </ul>
                )}
            </Modal>

            {/* 추가 모달 */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <h2 className="text-2xl font-bold mb-4">위시리스트 추가하기</h2>
                <input
                    type="text"
                    value={newWishListName}
                    onChange={(e) => setNewWishListName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border rounded p-2 mb-4 w-full"
                    placeholder="위시리스트 이름"
                />
                <button onClick={handleAddWishList} className="bg-blue-500 text-white p-2 rounded">추가하기</button>
            </Modal>

            {message && (
                <Modal isOpen={true} onClose={() => setMessage(null)}>
                    <h2 className="text-xl font-bold mb-4">{message}</h2>
                </Modal>
            )}
        </>
    );
};

export default HeartButton;