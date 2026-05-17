import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { submissions } from "@/data/dummyData";

export default function SubmissionsPage() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Submissions" description="Monitor all participant submissions in real-time">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
          <Button variant="outline" size="sm" className="gap-1.5 ml-2 h-8">
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
        </div>
      </PageHeader>

      <Card className="border-border/50 bg-card">
        <CardContent className="p-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-muted/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Wrong Answer">Wrong Answer</SelectItem>
              <SelectItem value="Time Limit">Time Limit</SelectItem>
              <SelectItem value="Runtime Error">Runtime Error</SelectItem>
              <SelectItem value="Compilation Error">Compilation Error</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-8" />
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Problem</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Language</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Runtime</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Memory</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <>
                  <TableRow key={sub.id} className="border-border/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}>
                    <TableCell>{expandedId === sub.id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}</TableCell>
                    <TableCell className="font-medium text-sm">{sub.user}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.problem}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{sub.language}</Badge></TableCell>
                    <TableCell><StatusBadge status={sub.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.runtime}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.memory}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sub.time}</TableCell>
                  </TableRow>
                  {expandedId === sub.id && (
                    <TableRow key={`${sub.id}-code`} className="border-border/30">
                      <TableCell colSpan={8} className="p-0">
                        <div className="bg-muted/30 p-4 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">Submitted Code</p>
                          <pre className="bg-background/50 rounded-lg p-4 text-xs font-mono text-foreground/80 overflow-x-auto">
{`#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for(int i = 0; i < n; i++) cin >> arr[i];
    // Solution implementation...
    return 0;
}`}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
