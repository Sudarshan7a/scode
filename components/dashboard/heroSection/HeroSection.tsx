import React from "react";
import RoomJoinForm from "./RoomJoinForm";
import ProductHighlightCard from "./ProductHighlightCard";
import HeroSectionTitle from "./HeroSectionTitle";
// import ScheduleModal from "@/components/schedule/ScheduleModal";

function HeroSection() {
  return (
    <section className="w-full bg-mybackground from-gray-50 to-white mb-20">
      <div className="flex flex-col items-center justify-around w-full h-full px-4 mx-auto max-w-7xl lg:flex-row lg:px-8">
        <div className="flex flex-col items-start justify-center w-full max-w-xl gap-4">
          <HeroSectionTitle />
          {/* <p className="text-lg text-myforeground/80 ">
            Your interactive coding platform for real-time collaboration,
            practice interviews, and skills development.
          </p> */}
          <RoomJoinForm />
          <div className="h-[1px] w-full bg-myforeground"></div>
        </div>

        <div className="w-full max-w-md">
          <ProductHighlightCard />
        </div>
      </div>
      {/* <ScheduleModal /> */}
    </section>
  );
}

export default HeroSection;
