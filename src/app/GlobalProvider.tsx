import {SearchProvider} from "./components/SearchContext"
import {ModalWishlistProvider} from "./context/ModalWishlistContext"
import {WishlistProvider} from "./context/WishlistContext"


const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SearchProvider>
            <WishlistProvider>
                <ModalWishlistProvider>
                    {children}
                </ModalWishlistProvider>
            </WishlistProvider>
        </SearchProvider>
    )
}

export default GlobalProvider