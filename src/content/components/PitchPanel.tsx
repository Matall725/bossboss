import React, { useState } from "react";
import { Copy, Check, Loader2, X, MessageSquarePlus, Search, ChevronDown, ChevronUp } from "lucide-react";

type Phase = "idle" | "analyzing" | "analyzed" | "generating" | "done" | "error";

interface PitchPanelProps {
  onAnalyze: () => Promise<{ success: boolean; analysis?: string; error?: string }>;
  onGenerate: (jdAnalysis?: string) => Promise<{ success: boolean; pitch?: string; error?: string }>;
}

export function PitchPanel({ onAnalyze, onGenerate }: PitchPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [analysis, setAnalysis] = useState("");
  const [pitch, setPitch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const handleAnalyze = async () => {
    setPhase("analyzing");
    setErrorMsg("");
    try {
      const res = await onAnalyze();
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        setPhase("analyzed");
      } else {
        setErrorMsg(res.error || "分析失败");
        setPhase("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  };

  const handleGenerate = async () => {
    setPhase("generating");
    setCopied(false);
    setErrorMsg("");
    try {
      const res = await onGenerate(analysis || undefined);
      if (res.success && res.pitch) {
        setPitch(res.pitch);
        setPhase("done");
      } else {
        setErrorMsg(res.error || "生成失败");
        setPhase("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  };

  const handleCopy = async () => {
    if (!pitch) return;
    try {
      await navigator.clipboard.writeText(pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Store analysis for chat page to pick up
  if (analysis) {
    try {
      chrome.storage.local.set({ lastJDAnalysis: analysis });
    } catch {}
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-[999999]"
      >
        <MessageSquarePlus size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-xl z-[999999] border border-gray-200 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquarePlus size={18} />
          <h3 className="font-semibold text-sm m-0 leading-none">BOSS Agent</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700/50 p-1 rounded-md">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex-1 max-h-[450px] overflow-y-auto">
        {/* Idle state */}
        {phase === "idle" && (
          <div className="text-center py-3">
            <p className="text-sm text-gray-500 mb-3">先分析岗位，再精准打招呼</p>
            <button
              onClick={handleAnalyze}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Search size={16} /> AI 深度分析岗位
            </button>
          </div>
        )}

        {/* Analyzing */}
        {phase === "analyzing" && (
          <div className="flex flex-col items-center py-6 text-indigo-500 gap-3">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-sm font-medium">正在深度分析岗位...</span>
          </div>
        )}

        {/* Analysis result */}
        {(phase === "analyzed" || phase === "generating" || phase === "done") && analysis && (
          <div className="mb-3">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex items-center justify-between w-full text-left text-xs font-semibold text-indigo-600 mb-1"
            >
              <span>📊 岗位分析报告</span>
              {showAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showAnalysis && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {analysis}
              </div>
            )}
          </div>
        )}

        {/* Generating pitch */}
        {phase === "generating" && (
          <div className="flex flex-col items-center py-4 text-blue-500 gap-2">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">基于分析生成打招呼...</span>
          </div>
        )}

        {/* Pitch result */}
        {phase === "done" && pitch && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">💬 打招呼话术</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {pitch}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition-colors"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                {copied ? "已复制！" : "一键复制"}
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-3 text-sm">
            <p className="font-semibold mb-1">出现错误：</p>
            <p className="break-words text-xs">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-2">
        {phase === "analyzed" && (
          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2"
          >
            <MessageSquarePlus size={16} /> 基于分析生成打招呼
          </button>
        )}
        {(phase === "done" || phase === "error") && (
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-medium py-2 px-3 rounded-lg"
            >
              重新分析
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg"
            >
              重新生成话术
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
