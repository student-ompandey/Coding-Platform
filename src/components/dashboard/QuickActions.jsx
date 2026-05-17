import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Plus, Megaphone, Zap } from "lucide-react";

const actions = [
  { label: "Start Contest", icon: Play, variant: "default", className: "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-cyan-500/20" },
  { label: "Add Question", icon: Plus, variant: "outline" },
  { label: "Announcement", icon: Megaphone, variant: "outline" },
];

export function QuickActions() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Zap className="size-4 text-amber-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className={`w-full justify-start gap-2 h-10 ${action.className || ""}`}
          >
            <action.icon className="size-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
