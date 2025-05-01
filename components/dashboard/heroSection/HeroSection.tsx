import React from "react";
import RoomJoinForm from "./RoomJoinForm";
import ProductHighlightCard from "./ProductHighlightCard";
import HeroSectionTitle from "./HeroSectionTitle";

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-around w-full h-full gap-4 px-4  mx-auto lg:flex-row lg:gap-8 lg:px-20">
      {" "}
      <div className="">
        <HeroSectionTitle />
        <RoomJoinForm />
      </div>
      <div>
        <ProductHighlightCard />
      </div>
      {/* Add any additional components or elements here */}
    </div>
  );
}

export default HeroSection;
