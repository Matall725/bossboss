/**
 * BOSS 直聘聊天界面 DOM 数据嗅探器
 * 负责从聊天页面中提取：对方消息记录、当前职位信息
 */

/** 提取对方（HR）最近的聊天消息 */
export function extractChatMessages(maxCount = 5): string[] {
  const messages: string[] = [];

  // BOSS 直聘聊天气泡的常见选择器（兼容多种页面版本）
  const selectors = [
    ".chat-message .message-text",        // 通用消息文本
    ".message-item .text",                 // 老版布局
    "[class*='message'] [class*='text']",  // 模糊匹配
    ".chat-record .record-item .text-con", // 另一种布局
    ".msg-text",                           // 简洁版
  ];

  for (const selector of selectors) {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      // 取最后 maxCount 条
      const startIdx = Math.max(0, nodes.length - maxCount);
      for (let i = startIdx; i < nodes.length; i++) {
        const text = nodes[i]?.textContent?.trim();
        if (text) messages.push(text);
      }
      break;
    }
  }

  // 如果上面的精确选择器都没命中，做一次宽泛的兜底扫描
  if (messages.length === 0) {
    const allBubbles = document.querySelectorAll("[class*='msg'], [class*='message'], [class*='chat-item']");
    const startIdx = Math.max(0, allBubbles.length - maxCount);
    for (let i = startIdx; i < allBubbles.length; i++) {
      const text = allBubbles[i]?.textContent?.trim();
      if (text && text.length > 2 && text.length < 500) {
        messages.push(text);
      }
    }
  }

  return messages;
}

/** 提取当前聊天窗口关联的职位信息（通常在聊天页右侧或顶部） */
export function extractChatJobInfo(): string | null {
  const selectors = [
    ".job-detail-card",
    ".chat-job",
    ".job-info",
    "[class*='job-card']",
    "[class*='position']",
    ".chat-header .title",
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent) {
      return el.textContent.trim();
    }
  }

  return null;
}

/** 获取 BOSS 聊天输入框的 DOM 元素 */
export function getChatInputElement(): HTMLElement | null {
  const selectors = [
    ".chat-input textarea",
    ".chat-input [contenteditable]",
    "[class*='chat-input'] textarea",
    "[class*='chat-input'] [contenteditable]",
    ".message-input textarea",
    ".message-input [contenteditable]",
    "[class*='editor'] [contenteditable]",
    "textarea[class*='input']",
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el) return el;
  }

  return null;
}

/** 将文本填入聊天输入框 */
export function fillChatInput(text: string): boolean {
  const input = getChatInputElement();
  if (!input) return false;

  if (input.tagName === "TEXTAREA" || input.tagName === "INPUT") {
    // 标准 textarea / input
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value"
    )?.set || Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, text);
    } else {
      (input as HTMLTextAreaElement).value = text;
    }

    // 触发 React/Vue 识别的 input 事件
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    // contenteditable div
    input.textContent = text;
    input.dispatchEvent(new InputEvent("input", { bubbles: true, data: text }));
  }

  input.focus();
  return true;
}
