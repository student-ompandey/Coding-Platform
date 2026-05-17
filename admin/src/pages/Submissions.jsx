import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw, Loader2 } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { toast } from "sonner";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getAll();
      setSubmissions(res.data);
    } catch { toast.error("Failed to load submissions"); }
    finally { setLoading(false); }
  };

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Submissions" description="Monitor all participant submissions in real-time">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
          <Button variant="outline" size="sm" className="gap-1.5 ml-2 h-8" onClick={fetchSubmissions}>
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
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No submissions found</TableCell></TableRow>
              )}
              {filtered.map((sub) => (
                <>
                  <TableRow key={sub._id} className="border-border/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id)}>
                    <TableCell>{expandedId === sub._id ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}</TableCell>
                    <TableCell className="font-medium text-sm">{sub.userId?.name || "Unknown"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.questionId?.title || "Unknown"}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{sub.language}</Badge></TableCell>
                    <TableCell><StatusBadge status={sub.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.runtime}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.memory}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{timeAgo(sub.createdAt)}</TableCell>
                  </TableRow>
                  {expandedId === sub._id && (
                    <TableRow key={`${sub._id}-code`} className="border-border/30">
                      <TableCell colSpan={8} className="p-0">
                        <div className="bg-muted/30 p-4 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">Submitted Code</p>
                          <pre className="bg-background/50 rounded-lg p-4 text-xs font-mono text-foreground/80 overflow-x-auto max-h-60">{sub.code}</pre>
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
