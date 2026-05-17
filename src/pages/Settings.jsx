import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings as SettingsIcon, Globe, Shield, Key, Palette, Trash2, Plus, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [platformName, setPlatformName] = useState("CodeArena");

  const admins = [
    { name: "Admin User", email: "admin@codearena.io", role: "Super Admin", avatar: "AD" },
    { name: "John Doe", email: "john@codearena.io", role: "Moderator", avatar: "JD" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Configure platform settings and preferences" />

      {/* Platform */}
      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Globe className="size-4 text-primary" /> Platform Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Platform Name</Label><Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Platform URL</Label><Input defaultValue="https://codearena.io" className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Support Email</Label><Input defaultValue="support@codearena.io" className="bg-muted/50" /></div>
            <div className="space-y-2"><Label>Max Concurrent Users</Label><Input type="number" defaultValue="1000" className="bg-muted/50" /></div>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0"><Save className="size-3.5" /> Save Changes</Button>
        </CardContent>
      </Card>

      {/* Admin Management */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2"><Shield className="size-4 text-primary" /> Admin Management</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => toast.info("Add admin dialog coming soon")}><Plus className="size-3.5" /> Add Admin</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.email} className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="size-9"><AvatarFallback className="bg-muted text-xs font-semibold">{admin.avatar}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{admin.email} · {admin.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive"><Trash2 className="size-3.5" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Key className="size-4 text-primary" /> API Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judge0 API Key</Label>
            <div className="flex gap-2">
              <Input type={showApiKey ? "text" : "password"} defaultValue="sk-judge0-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="bg-muted/50 font-mono text-xs flex-1" />
              <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button>
            </div>
          </div>
          <div className="space-y-2"><Label>Judge0 API URL</Label><Input defaultValue="https://judge0-ce.p.rapidapi.com" className="bg-muted/50 font-mono text-xs" /></div>
          <div className="space-y-2"><Label>Webhook URL</Label><Input defaultValue="https://codearena.io/api/webhook" className="bg-muted/50 font-mono text-xs" /></div>
          <Button className="gap-2" variant="outline"><Save className="size-3.5" /> Save API Settings</Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-border/50 bg-card">
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Palette className="size-4 text-primary" /> Theme Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
            <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Use dark theme across the platform</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
            <div><p className="text-sm font-medium">Animations</p><p className="text-xs text-muted-foreground">Enable smooth UI animations</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/30">
            <div><p className="text-sm font-medium">Sound Notifications</p><p className="text-xs text-muted-foreground">Play sounds for notifications</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
