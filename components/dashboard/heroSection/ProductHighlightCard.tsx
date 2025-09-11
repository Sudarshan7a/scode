"use client";
import React, { useState, useEffect, useCallback } from "react";
import { productHighlights } from "@/constants/productHighlights";
import VideoIcon from "@/components/icons/VideoIcon";
import ChartIcon from "@/components/icons/ChartIcon";
import LightningIcon from "@/components/icons/LightningIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import ShieldIcon from "@/components/icons/ShieldIcon";

function ProductHighlightCard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Single event handler using event delegation
  const handleSlideClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const index = parseInt(e.currentTarget.dataset.index || "0", 10);
      setCurrentSlide(index);
    },
    []
  );

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productHighlights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "VideoIcon":
        return <VideoIcon className="w-10 h-10 text-primary" />;
      case "ChartIcon":
        return <ChartIcon className="w-10 h-10 text-primary" />;
      case "LightningIcon":
        return <LightningIcon className="w-10 h-10 text-primary" />;
      case "NotificationIcon":
        return <NotificationIcon className="w-10 h-10 text-primary" />;
      case "ShieldIcon":
        return <ShieldIcon className="w-10 h-10 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md p-6 overflow-hidden ">
      <div className="relative h-60">
        {productHighlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center h-full">
              <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/10">
                {getIconComponent(highlight.iconName)}
              </div>
              <h3 className="mb-3 text-2xl font-medium text-center font-navbar">
                {highlight.title}
              </h3>
              <p className="text-center text-gray-400">
                {highlight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Carousel indicators */}
      <div className="flex justify-center gap-3 mt-6">
        {productHighlights.map((_, index) => (
          <button
            key={index}
            data-index={index}
            onClick={handleSlideClick}
            className={`w-2.5 h-2.5 rounded-full transition-all hover:bg-primary/70 cursor-pointer ${
              index === currentSlide ? "w-6 bg-primary" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <p className="text-sm text-gray-500">Click dots to navigate</p>
      </div>
    </div>
  );
}

export default ProductHighlightCard;
