import React from "react";
import { createRoot } from "react-dom/client";
import { ChatPanel } from "./components/ChatPanel";
import { extractChatMessages, extractChatJobInfo, fillChatInput } from "./chatExtractor";
import tailwindStyle from "./css/index.css?inline";

function initChatAssistant() {
  if (document.getElementById("boss-agent-chat-host")) return;

  // Try to mount immediately or wait via observer
  const tryMount = () => {
    if (document.getElementById("boss-agent-chat-host")) return true;
    mountPanel();
    return true;
  };

  // Use MutationObserver as fallback
  const observer = new MutationObserver(() => {
    if (document.body && !document.getElementById("boss-agent-chat-host")) {
      observer.disconnect();
      tryMount();
    }
  });

  if (document.body) {
    tryMount();
  } else {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Absolute fallback
  setTimeout(() => {
    observer.disconnect();
    tryMount();
  }, 3000);
}

function mountPanel() {
  const host = document.createElement("div");
  host.id = "boss-agent-chat-host";
  host.style.cssText = "position:fixed;bottom:80px;right:20px;z-index:999999;width:360px;";

  const shadowRoot = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = tailwindStyle;
  shadowRoot.appendChild(style);

  const container = document.createElement("div");
  shadowRoot.appendChild(container);

  document.body.appendChild(host);

  const handleGenerate = async (intent: string): Promise<{ success: boolean; reply?: string; error?: string }> => {
    return new Promise((resolve) => {
      const chatHistory = extractChatMessages(5);
      const jobInfo = extractChatJobInfo();

      // Try to retrieve stored JD analysis from the JD page
      chrome.storage.local.get("lastJDAnalysis", (result) => {
        const jdAnalysis = result.lastJDAnalysis || null;

        chrome.runtime.sendMessage(
          {
            action: "GENERATE_CHAT_REPLY",
            chatHistory,
            jobInfo,
            jdAnalysis,
            intent,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              resolve({ success: false, error: "Extension disconnected. Please refresh." });
              return;
            }
            resolve(response);
          }
        );
      });
    });
  };

  const handleFillInput = (text: string): boolean => {
    return fillChatInput(text);
  };

  const root = createRoot(container);
  root.render(<ChatPanel onGenerate={handleGenerate} onFillInput={handleFillInput} />);
}

// Activate on chat pages
if (window.location.href.includes("chat") || window.location.href.includes("geek")) {
  initChatAssistant();
}
