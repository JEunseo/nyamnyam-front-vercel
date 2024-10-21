// import { useModalWishlistContext } from "../context/ModalWishlistContext";
// import { useWishlist } from "../context/WishlistContext";

// export const ModalWishlist = () => {
//     const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
//     const { wishlistState } = useWishlist();

//     console.log("Modal Open Status:", isModalOpen); // 여기를 확인

//     if (!isModalOpen) return null; // 모달이 닫혀 있으면 아무것도 렌더링하지 않음

//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <button onClick={closeModalWishlist}>닫기</button>
//                 {/* 위시리스트 내용 */}
//             </div>
//         </div>
//     );
// };
