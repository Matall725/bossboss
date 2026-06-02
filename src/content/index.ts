import { extractJobDescription } from "./extractor";

function createPanel() {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;bottom:20px;right:20px;width:300px;background:white;box-shadow:0 4px 6px -1px rgb(0 0 0/0.1);border-radius:8px;padding:16px;z-index:999999;border:1px solid #e5e7eb";

  const status = document.createElement("div");
  status.innerText = "Ready to analyze...";
  status.style.cssText = "font-size:14px;color:#6b7280;margin-bottom:10px;white-space:pre-wrap";

  const btn = document.createElement("button");
  btn.innerText = "Generate Pitch";
  btn.style.cssText = "width:100%;padding:8px;background:#2563eb;color:white;border:none;border-radius:4px;cursor:pointer";

  btn.onclick = async () => {
    const jd = extractJobDescription();
    if (!jd) {
      status.innerText = "Error: Could not find job description.";
      status.style.color = "red";
      return;
    }

    status.innerText = "Generating...";
    btn.disabled = true;

    chrome.runtime.sendMessage(
      { action: "GENERATE_PITCH", jobDescription: jd },
      (response) => {
        btn.disabled = false;
        if (response.success) {
          status.innerText = response.pitch;
          status.style.color = "black";
        } else {
          status.innerText = `Error: ${response.error}`;
          status.style.color = "red";
        }
      }
    );
  };

  container.appendChild(status);
  container.appendChild(btn);

  const host = document.createElement("div");
  const shadowRoot = host.attachShadow({ mode: "open" });
  shadowRoot.appendChild(container);

  document.body.appendChild(host);
}

if (window.location.href.includes("job_detail")) {
  createPanel();
}
