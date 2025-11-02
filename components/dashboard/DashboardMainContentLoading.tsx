import HeroSection from "./heroSection/HeroSection";
import UpcomingRoomsClient from "./upcommingRooms/UpcomingRoomsClient";
import WelcomeBanner from "./WelcomeBanner";
import React from "react";
import { cookies } from "next/headers";
import { getUser as getUserFromDb } from "@/lib/getMongoData";
import { User } from "@/types/user";

type DashboardUser = User | { id: null; name: string };

async function getUser(): Promise<DashboardUser> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) return { id: null, name: "Guest" };

  try {
    const userDoc = await getUserFromDb(userId);
    if (!userDoc) return { id: null, name: "Guest" };
    return {
      id: userDoc.id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
    };
  } catch {
    return { id: null, name: "Guest" };
  }
}

export default async function DashboardMainContentLoading(): Promise<React.ReactNode> {
  const user = await getUser();

  return (
    <div>
      <WelcomeBanner username={user?.name ?? "Guest"} />
      <HeroSection />
      <UpcomingRoomsClient />
      {/* <YourActivitiesClient /> */}
    </div>
  );
}
