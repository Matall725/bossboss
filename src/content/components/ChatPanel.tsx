import React, { useState } from "react";
import { Loader2, Copy, Check, Zap, DollarSign, Shield, HandHeart, X, ChevronUp, ChevronDown } from "lucide-react";

interface ChatPanelProps {
  onGenerate: (intent: string) => Promise<{ success: boolean; reply?: string; error?: string }>;
  onFillInput: (text: string) => boolean;
}

type Status = "idle" | "loading" | "success" | "error";

const INTENT_BUTTONS = [
  { key: "smart",   label: "⚡ 智能回复",   icon: Zap,       color: "bg-blue-500 hover:bg-blue-600" },
  { key: "salary",  label: "💰 委婉谈薪",   icon: DollarSign, color: "bg-amber-500 hover:bg-amber-600" },
  { key: "explain", label: "🛡️ 解释原因",   icon: Shield,    color: "bg-teal-500 hover:bg-teal-600" },
  { key: "reject",  label: "👋 高情商拒绝",  icon: HandHeart, color: "bg-rose-400 hover:bg-rose-500" },
];

export function ChatPanel({ onGenerate, onFillInput }: ChatPanelProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [reply, setReply] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [filled, setFilled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleGenerate = async (intent: string) => {
    setStatus("loading");
    setReply("");
    setErrorMsg("");
    setCopied(false);
    setFilled(false);

    try {
      const res = await onGenerate(intent);
      if (res.success && res.reply) {
        setReply(res.reply);
        setStatus("success");
      } else {
        setErrorMsg(res.error || "生成失败");
        setStatus("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "内部异常");
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    if (!reply) return;
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const handleFill = () => {
    if (!reply) return;
    const ok = onFillInput(reply);
    if (ok) {
      setFilled(true);
      setTimeout(() => setFilled(false), 2000);
    }
  };

  if (collapsed) {
    return (
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Zap size={12} /> BOSS Agent <ChevronUp size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 px-3 py-2 flex justify-between items-center">
        <span className="text-white text-xs font-semibold flex items-center gap-1.5">
          <Zap size={14} /> BOSS Agent · 聊天助手
        </span>
        <div className="flex gap-1">
          <button onClick={() => setCollapsed(true)} className="text-white/80 hover:text-white p-0.5" title="收起">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* 意图按钮组 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {INTENT_BUTTONS.map(btn => (
            <button
              key={btn.key}
              onClick={() => handleGenerate(btn.key)}
              disabled={status === "loading"}
              className={`${btn.color} text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* 状态展示 */}
        {status === "loading" && (
          <div className="flex items-center gap-2 text-blue-500 py-3 justify-center">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">AI 正在思考中...</span>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-2 text-xs mt-1">
            <span className="font-semibold">错误：</span>{errorMsg}
          </div>
        )}

        {status === "success" && reply && (
          <div className="mt-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {reply}
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md transition-colors"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={handleFill}
                className="flex items-center gap-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded-md transition-colors"
              >
                {filled ? <Check size={12} /> : <Zap size={12} />}
                {filled ? "已填入！" : "填入输入框"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
