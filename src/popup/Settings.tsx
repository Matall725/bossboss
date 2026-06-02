import React, { useState, useEffect } from "react";
import { getSettings, saveSettings, UserSettings } from "../utils/storage";

export const Settings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleChange = (field: keyof UserSettings, value: string) => {
    if (!settings) return;
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (!settings) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 flex flex-col gap-4 h-full">
      <h1 className="text-xl font-bold text-gray-800">Settings</h1>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Provider</label>
        <select
          value={settings.provider}
          onChange={(e) => handleChange("provider", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="deepseek">DeepSeek</option>
          <option value="openai">OpenAI</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">API Key</label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={(e) => handleChange("apiKey", e.target.value)}
          className="border p-2 rounded"
          placeholder="sk-..."
        />
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <label className="text-sm font-medium text-gray-700">Base Resume</label>
        <textarea
          value={settings.baseResume}
          onChange={(e) => handleChange("baseResume", e.target.value)}
          className="border p-2 rounded resize-none flex-grow min-h-[150px]"
          placeholder="Paste your full resume here..."
        />
      </div>
    </div>
  );
};