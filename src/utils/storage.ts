export interface UserSettings {
  apiKey: string;
  provider: "openai" | "deepseek" | "custom";
  baseUrl?: string;
  baseResume: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  apiKey: "",
  provider: "deepseek",
  baseResume: "",
};

export async function getSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get("settings");
  return result.settings || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ settings });
}