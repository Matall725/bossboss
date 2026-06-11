import { generatePitch, generateChatReply, analyzeJD } from "./llm";

console.log("Background script initialized");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_JD") {
    analyzeJD(request.jobDescription)
      .then(analysis => sendResponse({ success: true, analysis }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === "GENERATE_PITCH") {
    generatePitch(request.jobDescription, request.jdAnalysis || undefined)
      .then(pitch => sendResponse({ success: true, pitch }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === "GENERATE_CHAT_REPLY") {
    generateChatReply({
      chatHistory: request.chatHistory || [],
      jobInfo: request.jobInfo || null,
      jdAnalysis: request.jdAnalysis || null,
      intent: request.intent || "smart",
    })
      .then(reply => sendResponse({ success: true, reply }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});
