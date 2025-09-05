import DashboardMainContent from "@/components/dashboard/DashboardMainContent";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";

export default async function Home() {
  return (
    <AsyncErrorBoundary
      fallbackTitle="Dashboard Failed to Load"
      fallbackMessage="Unable to load your dashboard. Please refresh the page to continue."
    >
      <DashboardMainContent />
    </AsyncErrorBoundary>
  );
}
