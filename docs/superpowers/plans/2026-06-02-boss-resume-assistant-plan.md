# BOSS Zhipin Resume Assistant Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a MV3 Chrome extension that stores API keys/resumes locally, injects an AI helper panel on BOSS Zhipin job pages, and uses a Service Worker to manage background tasks.

**Architecture:** A Service Worker (Background) handles API calls and task queues. A React Popup manages settings. Content Scripts extract job details and inject UI panels.

**Tech Stack:** React, Tailwind CSS, Vite, Chrome Extension MV3, TypeScript.

---

### Task 1: Setup Project Infrastructure

- [ ] **Step 1: Write initial configuration**
Create `package.json`: Contains React, Vite, Tailwind, CRXJS dependencies.
- [ ] **Step 2: Add TypeScript config**
Create `tsconfig.json` for ES2020 frontend features.
- [ ] **Step 3: Setup Vite config**
Create `vite.config.ts` importing crx from vite-plugin.
- [ ] **Step 4: Install dependencies**
Run `npm install`
- [ ] **Step 5: Commit**

### Task 2: Extension Manifest and Entry Points

- [ ] **Step 1: Create MV3 Manifest**
Create `manifest.json` with background, content_scripts, popup definitions.
- [ ] **Step 2: Create entry scripts**
Create `src/background/index.ts` and `src/content/index.ts`
- [ ] **Step 3: Commit**

### Task 3: Storage Utility Layer

- [ ] **Step 1: Write type definitions and methods**
Create `src/utils/storage.ts` for Chrome local storage reading API keys and resume.
- [ ] **Step 2: Commit**

### Task 4: Popup Settings UI

- [ ] **Step 1: Setup Tailwind**
Create `tailwind.config.js` and `src/styles/tailwind.css`
- [ ] **Step 2: Build HTML & Settings Component**
Create `index.html` and `src/popup/Settings.tsx` to handle provider/API key/Resume form.
- [ ] **Step 3: Commit**

### Task 5: LLM API Invocation in Service Worker

- [ ] **Step 1: Write LLM calling logic**
Create `src/background/llm.ts` handling DeepSeek/OpenAI fetch requests.
- [ ] **Step 2: Add message listener**
Modify `src/background/index.ts` to listen for "GENERATE_PITCH".
- [ ] **Step 3: Commit**

### Task 6: Content Script UI Injection

- [ ] **Step 1: Write DOM extractor**
Create `src/content/extractor.ts` to grab DOM `.job-sec-text`.
- [ ] **Step 2: Inject basic UI**
Modify `src/content/index.ts` to inject floating panel and trigger message to Service Worker.
- [ ] **Step 3: Commit**
