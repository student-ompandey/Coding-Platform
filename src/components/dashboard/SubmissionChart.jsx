import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { submissionChartData } from "@/data/dummyData";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-cyan-400">Submissions: {payload[0].value}</p>
        <p className="text-sm font-semibold text-emerald-400">Accepted: {payload[1].value}</p>
      </div>
    );
  }
  return null;
}

export function SubmissionChart() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Submission Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={submissionChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="acceptedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.18 150)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.7 0.18 150)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260)" vertical={false} />
              <XAxis dataKey="time" stroke="oklch(0.5 0.01 260)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.01 260)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="submissions" stroke="oklch(0.7 0.15 180)" fill="url(#submissionGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="accepted" stroke="oklch(0.7 0.18 150)" fill="url(#acceptedGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3 justify-center">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs text-muted-foreground">Submissions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">Accepted</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
