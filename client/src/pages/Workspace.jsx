import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { questionService } from "@/services/questionService";
import { submissionService } from "@/services/submissionService";
import { toast } from "sonner";

const LANG_MAP = {
  "C++": "cpp",
  "Java": "java",
  "Python": "python",
  "JavaScript": "javascript",
};

export default function Workspace() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("output");

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await questionService.getById(id);
      setQuestion(res.data);
      setCode(res.data.starterCode?.[language] || "// Write your code here\n");
    } catch {
      toast.error("Failed to load problem");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (question?.starterCode?.[lang]) {
      setCode(question.starterCode[lang]);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    setStatus("Running...");
    setActiveTab("output");
    try {
      const res = await submissionService.runCode({ code, language, input: customInput });
      const data = res.data;
      setStatus(data.status);
      let out = "";
      if (data.stdout) out += data.stdout;
      if (data.stderr) out += (out ? "\n" : "") + data.stderr;
      if (data.compileOutput) out += (out ? "\n" : "") + data.compileOutput;
      setOutput(out || "No output");
    } catch (err) {
      setStatus("Error");
      setOutput(err.response?.data?.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput("");
    setStatus("Judging...");
    setActiveTab("output");
    try {
      const res = await submissionService.submitCode({ code, language, questionId: id });
      const data = res.data;
      setStatus(data.status);
      setOutput(`Status: ${data.status}\nTest Cases: ${data.testCasesPassed}/${data.totalTestCases}\nScore: ${data.score}`);
      if (data.status === "Accepted") toast.success("Accepted! 🎉");
      else toast.error(`${data.status}`);
    } catch (err) {
      setStatus("Error");
      setOutput(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading problem...</div>;

  const statusColor = status === "Accepted" ? "text-green-400" : status === "Ready" ? "text-zinc-400" : status.includes("Running") || status.includes("Judging") ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between shrink-0">
        <div className="font-bold text-lg truncate">{question?.title || "Problem"}</div>
        <div className="flex items-center gap-3">
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none">
            {(question?.supportedLanguages || ["C++", "Java", "Python", "JavaScript"]).map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button onClick={handleRun} disabled={running || submitting} className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-4 py-1.5 rounded text-sm transition-colors">
            {running ? "Running..." : "▶ Run"}
          </button>
          <button onClick={handleSubmit} disabled={running || submitting} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-1.5 rounded text-sm transition-colors">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/3 border-r border-zinc-800 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">{question?.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded ${question?.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : question?.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                {question?.difficulty}
              </span>
              <span className="text-xs text-zinc-500">{question?.points} pts</span>
            </div>
            <div className="prose prose-invert text-sm text-zinc-400 whitespace-pre-wrap">
              {question?.description || "No description available."}
            </div>
            {question?.sampleInput && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Sample Input</h3>
                <pre className="bg-zinc-900 rounded p-3 text-xs font-mono">{question.sampleInput}</pre>
              </div>
            )}
            {question?.sampleOutput && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Sample Output</h3>
                <pre className="bg-zinc-900 rounded p-3 text-xs font-mono">{question.sampleOutput}</pre>
              </div>
            )}
            {question?.explanation && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Explanation</h3>
                <p className="text-sm text-zinc-400">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor & Console Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={LANG_MAP[language] || "javascript"}
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Console */}
          <div className="h-52 border-t border-zinc-800 bg-zinc-900 flex flex-col">
            <div className="flex border-b border-zinc-800">
              <button onClick={() => setActiveTab("output")} className={`px-4 py-2 text-xs font-medium ${activeTab === "output" ? "text-white border-b-2 border-indigo-500" : "text-zinc-500"}`}>Output</button>
              <button onClick={() => setActiveTab("input")} className={`px-4 py-2 text-xs font-medium ${activeTab === "input" ? "text-white border-b-2 border-indigo-500" : "text-zinc-500"}`}>Custom Input</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === "output" ? (
                <div className="font-mono text-sm">
                  <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
                  {output && <pre className="mt-2 text-zinc-300 whitespace-pre-wrap">{output}</pre>}
                </div>
              ) : (
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input here..."
                  className="w-full h-full bg-transparent text-sm font-mono text-zinc-300 resize-none outline-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
