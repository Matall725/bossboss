import { getSettings } from "../utils/storage";

// ==================== JD Analysis ====================
export async function analyzeJD(jobDescription: string): Promise<string> {
  const settings = await getSettings();
  if (!settings.apiKey) {
    throw new Error("API Key not set");
  }

  const systemMessage = [
    "你是一个有10年招聘行业经验的资深HR顾问和求职导师。",
    "你正在帮一位求职者深度分析一个岗位的招聘需求(JD)。",
    "",
    "请从以下维度进行分析，用简洁的条目式输出：",
    "",
    "【岗位亮点】列出2-3个这个岗位吸引人的地方",
    "【潜在风险】列出2-3个可能的暗坑或需要警惕的信号（比如：模糊的职责描述可能意味着打杂、薪资面议通常偏低、急招可能说明离职率高等）",
    "【信息盲区】列出2-3个JD中没有明确说明但求职者应该在沟通中主动询问的关键问题",
    "【匹配建议】基于JD要求，给出求职者在沟通中应该重点突出的能力方向",
    "",
    "铁律：",
    "1. 只输出中文。",
    "2. 每个维度用2-3个要点，每个要点一句话，不要长篇大论。",
    "3. 分析要犀利、实用，不要说废话套话。",
  ].join("\n");

  const userMessage = "请分析以下岗位JD：\n\n" + jobDescription;

  return await callLLM(settings, systemMessage, userMessage);
}

// ==================== Pitch Generation (with analysis) ====================
export async function generatePitch(jobDescription: string, jdAnalysis?: string): Promise<string> {
  const settings = await getSettings();
  if (!settings.apiKey) {
    throw new Error("API Key not set");
  }

  if (!settings.baseResume || settings.baseResume.trim() === "") {
    throw new Error("Resume is empty");
  }

  const systemMessage = [
    "你是一个求职老手，正在帮我在BOSS直聘上给HR发第一条消息。",
    "",
    "铁律：",
    "1. 只准用中文，一个英文单词都不许出现。",
    "2. 这是聊天软件，不是写邮件。禁止出现Dear、Subject、此致敬礼等任何书面格式。",
    "3. 语气要像一个自信但不装的正常人在微信上跟人打招呼，口语化、接地气。",
    "4. 必须针对这个岗位的具体要求说话，让HR一眼看出你认真看了JD。",
    "5. 50到80字，不要多。直接输出可以发送的文字，不加任何旁白。",
  ].join("\n");

  const parts: string[] = [];
  parts.push("岗位JD：");
  parts.push(jobDescription);

  if (jdAnalysis) {
    parts.push("");
    parts.push("AI对这个岗位的分析结论（请参考这些洞察来让打招呼更有针对性）：");
    parts.push(jdAnalysis);
  }

  parts.push("");
  parts.push("我的简历（仅供参考，不要照搬）：");
  parts.push(settings.baseResume);

  return await callLLM(settings, systemMessage, parts.join("\n"));
}

// ==================== Chat Reply Generation ====================
export interface ChatReplyRequest {
  chatHistory: string[];
  jobInfo: string | null;
  jdAnalysis: string | null;
  intent: string;
}

const INTENT_MAP: Record<string, string> = {
  smart: "根据对方最新的消息内容，像正常人聊天一样自然地回复。如果对方问了问题就正面回答，如果对方在闲聊就接话，不要生硬地往简历上扯。",
  salary: "对方在聊薪资待遇。不要直接报数字，表达出你对岗位感兴趣但也尊重自己的价值，语气轻松不要像在谈判。",
  explain: "对方在问离职原因或空窗期之类的敏感话题。坦诚但正面地回答，一两句话带过，不要解释太多显得心虚。",
  reject: "我想结束这次聊天。礼貌但简短地表示感谢和暂时不合适，不要写小作文。",
};

export async function generateChatReply(request: ChatReplyRequest): Promise<string> {
  const settings = await getSettings();
  if (!settings.apiKey) {
    throw new Error("API Key not set");
  }

  const intentInstruction = INTENT_MAP[request.intent] || INTENT_MAP["smart"];

  const systemMessage = [
    "你正在帮我在BOSS直聘的聊天里回复HR。",
    "",
    "最重要的一条规则：你生成的回复必须读起来像一个真实的人在用手机打字聊天。",
    "不要用任何书面语、不要用排比句、不要用感叹号堆砌热情、不要说谢谢您的关注之类的客套话。",
    "就像你自己在微信里跟朋友的朋友聊工作一样，礼貌但松弛。",
    "",
    "其他规则：",
    "1. 只输出中文。",
    "2. 字数30到60字就够了，聊天不需要长篇大论。",
    "3. 直接输出我可以发送的文字，不要加引号、不要加旁白。",
    "4. 如果聊天记录里对方问了具体问题，就正面简洁地回答，别绕弯子。",
    "",
    "本次的回复策略：",
    intentInstruction,
  ].join("\n");

  const parts: string[] = [];

  if (request.jobInfo) {
    parts.push("当前聊的职位：" + request.jobInfo);
    parts.push("");
  }

  if (request.jdAnalysis) {
    parts.push("之前对这个岗位的分析（作为背景参考）：");
    parts.push(request.jdAnalysis);
    parts.push("");
  }

  if (request.chatHistory.length > 0) {
    parts.push("最近的聊天记录：");
    request.chatHistory.forEach((msg, i) => {
      parts.push((i + 1) + ". " + msg);
    });
    parts.push("");
  } else {
    parts.push("（暂未读取到聊天记录，请生成一句通用的友好回复）");
    parts.push("");
  }

  if (settings.baseResume && settings.baseResume.trim()) {
    parts.push("我的简历摘要：");
    parts.push(settings.baseResume);
  }

  return await callLLM(settings, systemMessage, parts.join("\n"));
}

// ==================== Core LLM Call ====================
async function callLLM(
  settings: { apiKey: string; baseUrl: string; model: string },
  systemMessage: string,
  userMessage: string
): Promise<string> {
  try {
    const response = await fetch(settings.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + settings.apiKey,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errData = await response.json();
        if (errData && errData.error && errData.error.message) {
          errorMsg = errData.error.message;
        }
      } catch (e) {
        // fallback
      }
      throw new Error("Request failed (" + response.status + "): " + errorMsg);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    throw new Error(error.message || "LLM API error");
  }
}
