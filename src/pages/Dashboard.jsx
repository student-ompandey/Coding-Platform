import { StatCard } from "@/components/dashboard/StatCard";
import { SubmissionChart } from "@/components/dashboard/SubmissionChart";
import { ContestTimer } from "@/components/dashboard/ContestTimer";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PageHeader } from "@/components/shared/PageHeader";
import { dashboardStats } from "@/data/dummyData";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your coding contest platform"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Chart + Timer Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SubmissionChart />
        </div>
        <ContestTimer />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopPerformers />
        <RecentSubmissions />
        <QuickActions />
      </div>
    </div>
  );
}
