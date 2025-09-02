"use client";

import HeroSection from "./heroSection/HeroSection";
import UpcomingRooms from "./upcommingRooms/UpcomingRooms";
import YourActivities from "./yourActivities/YourActivities";
import WelcomeBanner from "./WelcomeBanner";

function DashboardMainContent() {
  // https://lorem-api.com/api/lorem?paragraphs=2&seed=foo

  return (
    <div>
      <WelcomeBanner username={username} />
      <HeroSection />
      <UpcomingRooms rooms={upcomingRooms} />
      <YourActivities activities={activities} />
    </div>
  );
}

export default DashboardMainContent;
