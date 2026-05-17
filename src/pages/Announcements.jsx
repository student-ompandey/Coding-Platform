import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Clock, Bell } from "lucide-react";
import { announcements } from "@/data/dummyData";
import { toast } from "sonner";

export default function AnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("info");

  const handleSend = () => {
    if (!title || !message) { toast.error("Please fill in all fields"); return; }
    toast.success("Announcement sent to all participants");
    setTitle(""); setMessage("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Announcements" description="Broadcast messages to all participants" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Megaphone className="size-4 text-primary" /> New Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title..." className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows={5} className="bg-muted/50 resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSend} className="gap-2 flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0">
                <Send className="size-3.5" /> Broadcast
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => toast.info("Popup sent to all users")}>
                <Bell className="size-3.5" /> Popup
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => toast.info("Scheduling feature coming soon")}>
                <Clock className="size-3.5" /> Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Previous Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  <StatusBadge status={a.priority} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                  <span>{a.author}</span>
                  <span>•</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
