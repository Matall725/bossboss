import { getSettings } from "../utils/storage";

export async function generatePitch(jobDescription: string): Promise<string> {
  const settings = await getSettings();
  if (!settings.apiKey) {
    throw new Error("API Key not configured");
  }

  const prompt = `Based on the following resume and job description, write a concise, professional reach-out message (under 100 words) from the candidate to the HR. Highlight the most relevant skills. Do not include placeholders, return ONLY the message text. Resume: ${settings.baseResume} Job Description: ${jobDescription}`;

  const url = settings.provider === "deepseek"
    ? "https://api.deepseek.com/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  const data = await response.json();
  return data.choices[0].message.content.trim();
}