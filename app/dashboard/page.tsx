import DashboardMainContentLoading from "@/components/dashboard/DashboardMainContentLoading";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";

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
