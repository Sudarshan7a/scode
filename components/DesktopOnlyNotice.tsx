"use client";
import { useEffect, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

const MIN_WIDTH = 1024; // Minimum width for desktop experience

export default function DesktopOnlyNotice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      setIsMobile(width < MIN_WIDTH);
      
      const widthElement = document.getElementById("current-width");
      if (widthElement) {
        widthElement.textContent = width.toString();
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-mybackground flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center gap-4">
          <Smartphone className="w-16 h-16 text-mysecondary/30" />
          <Monitor className="w-16 h-16 text-mysecondary" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Desktop Experience Required
        </h1>
        
        <p className="text-lg text-foreground/70 mb-6">
          S-Code is optimized for desktop devices to provide the best coding and collaboration experience.
        </p>
        
        <div className="bg-mysecondary/10 border border-mysecondary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground/80">
            <strong>Minimum screen width:</strong> {MIN_WIDTH}px
          </p>
          <p className="text-sm text-foreground/80 mt-1">
            <strong>Your current width:</strong> <span id="current-width"></span>px
          </p>
        </div>
        
        <p className="text-foreground/60 text-sm">
          Please access S-Code from a desktop or laptop computer for the full experience.
        </p>
      </div>
    </div>
  );
}
