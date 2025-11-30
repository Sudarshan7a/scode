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
        return <VideoIcon className="w-10 h-10 text-mysecondary" />;
      case "ChartIcon":
        return <ChartIcon className="w-10 h-10 text-mysecondary" />;
      case "LightningIcon":
        return <LightningIcon className="w-10 h-10 text-mysecondary" />;
      case "NotificationIcon":
        return <NotificationIcon className="w-10 h-10 text-mysecondary" />;
      case "ShieldIcon":
        return <ShieldIcon className="w-10 h-10 text-mysecondary" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md p-8 overflow-hidden bg-mybackground rounded-2xl shadow-lg shadow-mysecondary/10 border border-mysecondary/20 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-mysecondary/5 via-transparent to-mysecondary/3 pointer-events-none rounded-2xl" />

      <div className="relative h-64">
        {productHighlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0 scale-100"
                : index < currentSlide
                ? "opacity-0 -translate-x-full scale-95"
                : "opacity-0 translate-x-full scale-95"
            }`}
          >
            <div className="flex flex-col items-center h-full">
              {/* Icon container with glow effect */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-mysecondary/20 blur-xl rounded-full scale-150" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-mysecondary/20 to-mysecondary/10 border border-mysecondary/20 shadow-md shadow-mysecondary/10">
                  {getIconComponent(highlight.iconName)}
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-center text-myforeground tracking-tight">
                {highlight.title}
              </h3>
              <p className="text-center text-myforeground/60 leading-relaxed text-sm max-w-xs">
                {highlight.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="relative flex justify-center gap-2 mt-6">
        {productHighlights.map((_, index) => (
          <button
            key={index}
            data-index={index}
            onClick={handleSlideClick}
            className={`h-2 rounded-full transition-all duration-300 ease-out hover:bg-mysecondary/70 cursor-pointer ${
              index === currentSlide
                ? "w-8 bg-mysecondary shadow-md shadow-mysecondary/30"
                : "w-2 bg-mysecondary/25 hover:bg-mysecondary/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="relative flex justify-center mt-4">
        <p className="text-xs text-myforeground/40 font-medium">
          Click dots to navigate
        </p>
      </div>
    </div>
  );
}

export default ProductHighlightCard;
