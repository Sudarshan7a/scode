import HeroSection from "./heroSection/HeroSection";
import UpcomingRooms from "./upcommingRooms/UpcomingRooms";
import YourActivities from "./yourActivities/YourActivities";
import WelcomeBanner from "./WelcomeBanner";
import React from "react";
import { cookies } from "next/headers";
import { connectToMongo } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { User } from "@/types/user";

async function getUser(): Promise<User> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { id: null, name: "Guest" };

  try {
    const { usersCollection } = await connectToMongo();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return { id: null, name: "Guest" };
    return { id: user._id.toString(), name: user.name, email: user.email };
  } catch {
    return { id: null, name: "Guest" };
  }
}

export default async function DashboardMainContent(): Promise<React.ReactNode> {
  const user = await getUser();

  return (
    <div>
      <WelcomeBanner username={user.name} />
      <HeroSection />
      <UpcomingRooms />
      <YourActivities />
    </div>
  );
}
