import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, FileCode2, Code } from "lucide-react";
import { questions } from "@/data/dummyData";
import { toast } from "sonner";

const starterCodes = {
  "C++": '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  Python: "# Your code here\n",
  Java: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
  JavaScript: "// Your code here\n",
};

export default function QuestionsPage() {
  const [questionList, setQuestionList] = useState(questions);
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [diff, setDiff] = useState("Easy");
  const [pts, setPts] = useState(100);
  const [codes, setCodes] = useState(starterCodes);
  const [testCases, setTestCases] = useState("Input: [2,7,11,15], target = 9\nOutput: [0,1]");
  const [ioExamples, setIoExamples] = useState("Example 1:\n  Input: nums = [2,7,11,15], target = 9\n  Output: [0,1]");
  const [activeLang, setActiveLang] = useState("C++");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const langs = ["C++", "Python", "Java", "JavaScript"];

  const openAdd = () => {
    setEditingQuestion(null);
    setTitle(""); setDesc(""); setDiff("Easy"); setPts(100);
    setCodes(starterCodes); setActiveLang("C++");
    setFormOpen(true);
  };

  const openEdit = (q) => {
    setEditingQuestion(q);
    setTitle(q.title); setDiff(q.difficulty); setPts(q.points);
    setCodes(starterCodes); setActiveLang("C++");
    setFormOpen(true);
  };

  const handleSave = () => {
    toast.success(editingQuestion ? "Question updated" : "Question created");
    setFormOpen(false);
  };

  const handleDelete = () => {
    setQuestionList((prev) => prev.filter((q) => q.id !== deleteTarget?.id));
    toast.success("Question deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Questions" description="Create and manage contest problems">
        <Button onClick={openAdd} className="gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-cyan-500/20">
          <Plus className="size-4" /> Add Question
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionList.map((q) => (
          <Card key={q.id} className="border-border/50 bg-card group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileCode2 className="size-4 text-primary shrink-0" />
                  <span className="truncate">{q.title}</span>
                </CardTitle>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(q)}><Pencil className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(q)}><Trash2 className="size-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={q.difficulty} />
                <StatusBadge status={q.status} />
                <Badge variant="outline" className="text-xs">{q.points} pts</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{q.submissions} submissions</span>
                <span>{q.accepted} accepted</span>
                <span>{((q.accepted / q.submissions) * 100).toFixed(0)}% rate</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {q.languages.map((l) => (
                  <Badge key={l} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{l}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="size-5 text-primary" />
              {editingQuestion ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Two Sum" className="bg-muted/50" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Problem description..." rows={4} className="bg-muted/50 resize-none" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={diff} onValueChange={setDiff}>
                  <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input type="number" value={pts} onChange={(e) => setPts(parseInt(e.target.value))} className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Starter Code</Label>
              <Tabs value={activeLang} onValueChange={setActiveLang}>
                <TabsList className="bg-muted/50 h-9">
                  {langs.map((l) => <TabsTrigger key={l} value={l} className="text-xs h-7 px-3">{l}</TabsTrigger>)}
                </TabsList>
                {langs.map((l) => (
                  <TabsContent key={l} value={l}>
                    <Textarea value={codes[l] || ""} onChange={(e) => setCodes({ ...codes, [l]: e.target.value })} className="bg-muted/50 font-mono text-xs resize-none min-h-[140px]" rows={7} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Test Cases</Label>
              <Textarea value={testCases} onChange={(e) => setTestCases(e.target.value)} rows={3} className="bg-muted/50 font-mono text-xs resize-none" />
            </div>
            <div className="space-y-2">
              <Label>I/O Examples</Label>
              <Textarea value={ioExamples} onChange={(e) => setIoExamples(e.target.value)} rows={3} className="bg-muted/50 font-mono text-xs resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => toast.info("Draft saved")}><Save className="size-3.5 mr-1.5" /> Save Draft</Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0">{editingQuestion ? "Update" : "Create"} Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Question" description={`Delete "${deleteTarget?.title}"? This cannot be undone.`} confirmText="Delete" destructive onConfirm={handleDelete} />
    </div>
  );
}
