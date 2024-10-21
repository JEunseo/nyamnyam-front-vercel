import React, { useEffect, useState, useCallback } from 'react';

interface ScrollToTopProps {}

const   ScrollToTop: React.FC<ScrollToTopProps> = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = useCallback(() => {
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            {isVisible && (
                <div 
                    onClick={scrollToTop} 
                    className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-[rgb(255,128,64)] text-white p-4 rounded-full cursor-pointer shadow-lg transition-transform transform hover:scale-105" 
                >
                    위로
                </div>
            )}
        </>
    );
};

export default ScrollToTop;