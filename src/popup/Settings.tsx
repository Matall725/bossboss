import React, { useState, useEffect, useRef } from "react";
import { getSettings, saveSettings, UserSettings } from "../utils/storage";
import { parseFileToText } from "../utils/fileParser";
import { Bot, Key, FileText, Settings as SettingsIcon, ExternalLink, Save, Link as LinkIcon, Cpu, UploadCloud, Loader2 } from "lucide-react";

// 定义预设的供应商模板
const PROVIDER_TEMPLATES = [
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    link: "https://platform.deepseek.com/"
  },
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    link: "https://platform.openai.com/api-keys"
  },
  {
    id: "moonshot",
    name: "Kimi (Moonshot)",
    baseUrl: "https://api.moonshot.cn/v1/chat/completions",
    model: "moonshot-v1-8k",
    link: "https://platform.moonshot.cn/"
  },
  {
    id: "dashscope",
    name: "阿里通义千问 (Qwen)",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-max",
    link: "https://dashscope.console.aliyun.com/"
  },
  {
    id: "custom",
    name: "📝 自定义 (Custom OpenAI Compatible)",
    baseUrl: "",
    model: "",
    link: ""
  }
];

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("custom");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      const matched = PROVIDER_TEMPLATES.find(
        (p) => p.baseUrl === s.baseUrl && p.model === s.model && p.id !== "custom"
      );
      setSelectedPreset(matched ? matched.id : "custom");
    });
  }, []);

  const handleChange = (field: keyof UserSettings, value: string) => {
    if (!settings) return;
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    saveSettings(newSettings);

    if (field === "baseUrl" || field === "model") {
      const matched = PROVIDER_TEMPLATES.find(
        (p) => p.baseUrl === newSettings.baseUrl && p.model === newSettings.model && p.id !== "custom"
      );
      setSelectedPreset(matched ? matched.id : "custom");
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === "custom") return;

    const preset = PROVIDER_TEMPLATES.find((p) => p.id === presetId);
    if (!preset || !settings) return;

    const newSettings = { ...settings, baseUrl: preset.baseUrl, model: preset.model };
    setSettings(newSettings);
    saveSettings(newSettings);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !settings) return;

    setIsUploading(true);
    try {
      const parsedText = await parseFileToText(file);
      handleChange("baseResume", parsedText);
    } catch (err: any) {
      alert(`解析文件失败: ${err.message}`);
    } finally {
      setIsUploading(false);
      // Reset input sequence to allow uploading the same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!settings) {
    return (
      <div className="flex h-[600px] w-[450px] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <Bot className="animate-pulse" />
          <span>正在加载配置...</span>
        </div>
      </div>
    );
  }

  const activePreset = PROVIDER_TEMPLATES.find(p => p.id === selectedPreset);

  return (
    <div className="flex flex-col h-[650px] w-[450px] bg-gray-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white shadow-md flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-blue-100" />
          <div>
            <h1 className="text-lg font-bold leading-tight">BOSS Agent</h1>
            <p className="text-xs text-blue-200">AI 求职辅助插件配置</p>
          </div>
        </div>
        <SettingsIcon size={20} className="text-blue-200 opacity-80" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-6 custom-scrollbar">
        <div className="space-y-4">

          {/* Provider Preset Section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-2">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Bot size={16} className="text-blue-500" />
              模型供应商 (快捷选择)
            </h2>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-sm rounded-lg focus:ring-blue-500 p-2.5 outline-none"
            >
              {PROVIDER_TEMPLATES.map(p => (
                 <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
             <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-purple-500" />接口地址
                </h2>
                <input
                  type="text"
                  value={settings.baseUrl}
                  onChange={(e) => handleChange("baseUrl", e.target.value)}
                  className="w-full border-gray-200 bg-gray-50 text-xs rounded-lg p-2 outline-none font-mono text-gray-600"
                />
             </div>
             <div className="w-[140px] bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Cpu size={14} className="text-indigo-500" />模型
                </h2>
                <input
                  type="text"
                  value={settings.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full border-gray-200 bg-gray-50 text-xs rounded-lg p-2 outline-none font-mono text-gray-600"
                />
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Key size={16} className="text-yellow-500" />API 密钥
              </h2>
              {activePreset?.link && (
                <a href={activePreset.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
                  获取密钥 <ExternalLink size={12} />
                </a>
              )}
            </div>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-sm rounded-lg p-2.5 outline-none font-mono"
            />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={16} className="text-green-500" />基础简历
              </h2>
              <div className="flex gap-3">
                <span className={`text-xs flex items-center gap-1 transition-opacity duration-300 ${saved ? 'opacity-100 text-green-600' : 'opacity-0'}`}>
                  <Save size={12} /> 已保存
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md border border-blue-200 transition-colors disabled:opacity-50"
                  title="支持解析 PDF 和 Docx 格式文件"
                >
                  {isUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                  {isUploading ? "正在解析..." : "上传附件"}
                </button>
                <input
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            <textarea
              value={settings.baseResume}
              onChange={(e) => handleChange("baseResume", e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-sm rounded-lg p-3 flex-1 min-h-[140px] resize-none"
              placeholder="除了手动输入外，你还可以点击右上角的【上传附件】自动抽取 PDF/Word 简历文字..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
