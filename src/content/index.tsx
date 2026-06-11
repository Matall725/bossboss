import React from "react";
import { createRoot } from "react-dom/client";
import { extractJobDescription } from "./extractor";
import { PitchPanel } from "./components/PitchPanel";
import tailwindStyle from "./css/index.css?inline";

function initApp() {
  if (document.getElementById("boss-agent-host")) return;

  const host = document.createElement("div");
  host.id = "boss-agent-host";
  const shadowRoot = host.attachShadow({ mode: "open" });

  const styleElement = document.createElement("style");
  styleElement.textContent = tailwindStyle;
  shadowRoot.appendChild(styleElement);

  const container = document.createElement("div");
  shadowRoot.appendChild(container);

  document.body.appendChild(host);

  const handleAnalyze = (): Promise<{ success: boolean; analysis?: string; error?: string }> => {
    return new Promise((resolve) => {
      const jd = extractJobDescription();
      if (!jd) {
        resolve({ success: false, error: "Unable to read JD from this page." });
        return;
      }

      chrome.runtime.sendMessage(
        { action: "ANALYZE_JD", jobDescription: jd },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: "Extension disconnected. Please refresh." });
            return;
          }
          resolve(response);
        }
      );
    });
  };

  const handleGenerate = (jdAnalysis?: string): Promise<{ success: boolean; pitch?: string; error?: string }> => {
    return new Promise((resolve) => {
      const jd = extractJobDescription();
      if (!jd) {
        resolve({ success: false, error: "Unable to read JD from this page." });
        return;
      }

      chrome.runtime.sendMessage(
        { action: "GENERATE_PITCH", jobDescription: jd, jdAnalysis: jdAnalysis || "" },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: "Extension disconnected. Please refresh." });
            return;
          }
          resolve(response);
        }
      );
    });
  };

  const root = createRoot(container);
  root.render(<PitchPanel onAnalyze={handleAnalyze} onGenerate={handleGenerate} />);
}

if (window.location.href.includes("job_detail")) {
  initApp();
}
