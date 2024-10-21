"use client";
import React, { useEffect, useState } from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";

export default function Star({ w, h, readonly, rate, onChange }: StarModel) {
  const [rating, setRating] = useState(rate || 0);

  useEffect(() => {
    if (typeof rate === "number") {
      setRating(rate);
    }
  }, [rate]);

  const handleClickStar = (index: number) => {
    if (!readonly) {
      const newRating = index + 1;
      if (rating === newRating) {
        setRating(0);
        onChange && onChange(0);
      } else {
        setRating(newRating);
        onChange && onChange(newRating);
      }
    }
  };

  // 별이 채워질 비율 계산
  const calculateRate = (rate: number, index: number): number => {
    if (rate >= index) {
      return 100; 
    } else if (rate > index - 1) {
      const decimal = rate - Math.floor(rate);
      return decimal * 100; 
    } else {
      return 0; 
    }
  };

  return (
    <div className={`flex`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const fillPercentage = calculateRate(rating, index + 1);
        return (
          <div
            className={`relative ${w} ${h} cursor-pointer`}
            key={index}
            style={{ position: "relative", display: "inline-block", width: '24px', height: '24px' }}
            onClick={() => handleClickStar(index)}
          >
            {/* 회색 별 */}
            <Icon.Star size={24} color="#9FA09C" weight="fill" style={{ position: "absolute" }} />
            {/* 노란색 별*/}
            <Icon.Star
              size={24}
              color="#FFD700"
              weight="fill"
              style={{
                position: "absolute",
                clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
