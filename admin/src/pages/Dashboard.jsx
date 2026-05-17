import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SubmissionChart } from "@/components/dashboard/SubmissionChart";
import { ContestTimer } from "@/components/dashboard/ContestTimer";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PageHeader } from "@/components/shared/PageHeader";
import { userService } from "@/services/userService";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getStats()
      .then(res => {
        const s = res.data;
        setStats([
          { label: "Total Users", value: s.totalUsers.toLocaleString(), change: "+12%", trend: "up", icon: "Users" },
          { label: "Active Participants", value: s.activeParticipants.toLocaleString(), change: "+8%", trend: "up", icon: "UserCheck" },
          { label: "Total Submissions", value: s.totalSubmissions.toLocaleString(), change: "+24%", trend: "up", icon: "Send" },
          { label: "Contest Status", value: s.contestStatus, change: "", trend: "neutral", icon: "Trophy" },
          { label: "Accepted Solutions", value: s.acceptedSubmissions.toLocaleString(), change: "+18%", trend: "up", icon: "CheckCircle" },
          { label: "System Status", value: s.systemStatus, change: "99.9%", trend: "up", icon: "Activity" },
        ]);
      })
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Dashboard" description="Overview of your coding contest platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(stats || []).map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SubmissionChart />
        </div>
        <ContestTimer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopPerformers />
        <RecentSubmissions />
        <QuickActions />
      </div>
    </div>
  );
}
