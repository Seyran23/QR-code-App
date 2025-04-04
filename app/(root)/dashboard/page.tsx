// app/dashboard/page.tsx
import ActivityCharts from "@/components/dashboard/ActivityCharts";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardStatsCards from "@/components/dashboard/StatsCards";

// app/dashboard/page.tsx
const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>

      <DashboardStatsCards />
      <ActivityCharts />
      <QuickActions />
      <RecentActivity />
    </div>
  );
};

export default DashboardPage;
