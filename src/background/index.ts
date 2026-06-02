import { generatePitch } from "./llm";

console.log("Background script initialized");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GENERATE_PITCH") {
    generatePitch(request.jobDescription)
      .then(pitch => sendResponse({ success: true, pitch }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async execution
  }
});
