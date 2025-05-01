import React from "react";
import HeroSection from "./heroSection/HeroSection";
import UpcomingRooms from "./upcommingRooms/UpcomingRooms";
import YourActivities from "./yourActivities/YourActivities";
import WelcomeBanner from "./WelcomeBanner";

function DashboardMainContent() {
  return (
    <div>
      <WelcomeBanner username="Username" />
      <HeroSection />
      <UpcomingRooms />
      <YourActivities />
    </div>
  );
}

export default DashboardMainContent;
