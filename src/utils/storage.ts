export interface UserSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
  baseResume: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  apiKey: "",
  baseUrl: "https://api.deepseek.com/v1/chat/completions",
  model: "deepseek-chat",
  baseResume: "",
};

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get("settings");
  // Merge missing defaults for backwards compatibility
  return { ...DEFAULT_SETTINGS, ...(result.settings || {}) };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ settings });
}