import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, Save, FileCode2, Code, Loader2 } from "lucide-react";
import { questionService } from "@/services/questionService";
import { toast } from "sonner";

const defaultStarterCodes = {
  "C++": '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  Python: "# Your code here\n",
  Java: "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
  JavaScript: "// Your code here\n",
};

export default function QuestionsPage() {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [diff, setDiff] = useState("Easy");
  const [pts, setPts] = useState(100);
  const [codes, setCodes] = useState(defaultStarterCodes);
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [testCases, setTestCases] = useState("");
  const [activeLang, setActiveLang] = useState("C++");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const langs = ["C++", "Python", "Java", "JavaScript"];

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await questionService.getAll();
      setQuestionList(res.data);
    } catch { toast.error("Failed to load questions"); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingQuestion(null);
    setTitle(""); setDesc(""); setDiff("Easy"); setPts(100);
    setCodes(defaultStarterCodes); setActiveLang("C++");
    setSampleInput(""); setSampleOutput(""); setExplanation(""); setTestCases("");
    setFormOpen(true);
  };

  const openEdit = (q) => {
    setEditingQuestion(q);
    setTitle(q.title); setDesc(q.description || ""); setDiff(q.difficulty); setPts(q.points);
    setCodes(q.starterCode || defaultStarterCodes); setActiveLang("C++");
    setSampleInput(q.sampleInput || ""); setSampleOutput(q.sampleOutput || "");
    setExplanation(q.explanation || "");
    setTestCases(q.hiddenTestCases?.map(tc => `${tc.input}|${tc.expectedOutput}`).join("\n") || "");
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!title) { toast.error("Title is required"); return; }
    setSaving(true);
    const hiddenTestCases = testCases.split("\n").filter(Boolean).map(line => {
      const [input, expectedOutput] = line.split("|");
      return { input: input?.trim() || "", expectedOutput: expectedOutput?.trim() || "" };
    }).filter(tc => tc.input && tc.expectedOutput);

    const data = { title, description: desc, difficulty: diff, points: pts, starterCode: codes, sampleInput, sampleOutput, explanation, hiddenTestCases, supportedLanguages: langs };
    try {
      if (editingQuestion) {
        await questionService.update(editingQuestion._id, data);
        toast.success("Question updated");
      } else {
        await questionService.create(data);
        toast.success("Question created");
      }
      setFormOpen(false);
      fetchQuestions();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await questionService.delete(deleteTarget._id);
      setQuestionList(prev => prev.filter(q => q._id !== deleteTarget._id));
      toast.success("Question deleted");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Questions" description="Create and manage contest problems">
        <Button onClick={openAdd} className="gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 shadow-lg shadow-cyan-500/20">
          <Plus className="size-4" /> Add Question
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionList.map((q) => (
          <Card key={q._id} className="border-border/50 bg-card group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
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
                <span>{q.submissions || 0} submissions</span>
                <span>{q.accepted || 0} accepted</span>
                <span>{q.submissions > 0 ? ((q.accepted / q.submissions) * 100).toFixed(0) : 0}% rate</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(q.supportedLanguages || []).map((l) => (
                  <Badge key={l} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{l}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questionList.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileCode2 className="size-12 mx-auto mb-4 opacity-30" />
          <p>No questions yet. Click "Add Question" to create one.</p>
        </div>
      )}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sample Input</Label>
                <Textarea value={sampleInput} onChange={(e) => setSampleInput(e.target.value)} rows={2} className="bg-muted/50 font-mono text-xs resize-none" placeholder="e.g. [2,7,11,15]\n9" />
              </div>
              <div className="space-y-2">
                <Label>Sample Output</Label>
                <Textarea value={sampleOutput} onChange={(e) => setSampleOutput(e.target.value)} rows={2} className="bg-muted/50 font-mono text-xs resize-none" placeholder="e.g. [0,1]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2} className="bg-muted/50 resize-none" placeholder="Because nums[0] + nums[1] == 9..." />
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
              <Label>Hidden Test Cases (one per line: input|expectedOutput)</Label>
              <Textarea value={testCases} onChange={(e) => setTestCases(e.target.value)} rows={3} className="bg-muted/50 font-mono text-xs resize-none" placeholder="2 7 11 15\n9|0 1" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-0">
              {saving ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Saving...</> : editingQuestion ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} title="Delete Question" description={`Delete "${deleteTarget?.title}"? This cannot be undone.`} confirmText="Delete" destructive onConfirm={handleDelete} />
    </div>
  );
}
