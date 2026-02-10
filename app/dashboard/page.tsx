import type { Metadata } from "next";
import DashboardMainContentLoading from "@/components/dashboard/DashboardMainContentLoading";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";

export const metadata: Metadata = {
  title: "Dashboard | S-Code",
  robots: { index: false, follow: false },
};

export default async function Home() {
  return (
    <AsyncErrorBoundary
      fallbackTitle="Dashboard Failed to Load"
      fallbackMessage="Unable to load your dashboard. Please refresh the page to continue."
    >
      <DashboardMainContentLoading />
    </AsyncErrorBoundary>
  );
}
