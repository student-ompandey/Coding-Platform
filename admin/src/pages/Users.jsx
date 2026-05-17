import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Ban, Eye, UserX, ChevronLeft, ChevronRight, Users as UsersIcon, Loader2 } from "lucide-react";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [profileUser, setProfileUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const perPage = 8;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleConfirmAction = async () => {
    try {
      if (confirmAction.type === "ban") {
        await userService.ban(confirmAction.user._id);
        toast.success(`${confirmAction.user.name} has been banned`);
      } else {
        await userService.disqualify(confirmAction.user._id);
        toast.success(`${confirmAction.user.name} has been disqualified`);
      }
      fetchUsers();
    } catch { toast.error("Action failed"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users" description="Manage participants and their access" />

      <Card className="border-border/50 bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-muted/50" />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40 bg-muted/50"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="disqualified">Disqualified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="Try adjusting your search or filter." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">College</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Score</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((user) => (
                    <TableRow key={user._id} className="border-border/30 hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8"><AvatarFallback className="bg-muted text-xs font-semibold">{user.avatar}</AvatarFallback></Avatar>
                          <span className="font-medium text-sm">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{user.college}</TableCell>
                      <TableCell className="text-sm font-semibold">{user.score}</TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => setProfileUser(user)}><Eye className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-8 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" onClick={() => setConfirmAction({ type: "ban", user })}><Ban className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="size-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => setConfirmAction({ type: "disqualify", user })}><UserX className="size-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-8" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" className="size-8 text-xs" onClick={() => setPage(i + 1)}>{i + 1}</Button>
                ))}
                <Button variant="outline" size="icon" className="size-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Dialog open={!!profileUser} onOpenChange={() => setProfileUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>User Profile</DialogTitle></DialogHeader>
          {profileUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16"><AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-500 text-white text-lg font-bold">{profileUser.avatar}</AvatarFallback></Avatar>
                <div><h3 className="text-lg font-bold">{profileUser.name}</h3><p className="text-sm text-muted-foreground">{profileUser.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">College</p><p className="text-sm font-medium mt-0.5">{profileUser.college}</p></div>
                <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Score</p><p className="text-sm font-bold text-primary mt-0.5">{profileUser.score}</p></div>
                <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Problems Solved</p><p className="text-sm font-medium mt-0.5">{profileUser.solved || 0}</p></div>
                <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Status</p><div className="mt-1"><StatusBadge status={profileUser.status} /></div></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)} title={confirmAction?.type === "ban" ? "Ban User" : "Disqualify User"} description={`Are you sure you want to ${confirmAction?.type} ${confirmAction?.user?.name}? This action can be reversed later.`} confirmText={confirmAction?.type === "ban" ? "Ban" : "Disqualify"} destructive onConfirm={handleConfirmAction} />
    </div>
  );
}
