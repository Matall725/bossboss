<div align="center">

# 🤖 BOSS Agent

### AI 驱动的 BOSS 直聘智能求职助手

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/Matall725/bossboss)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="center">
  <strong>🔒 本地运行 · 🔑 自带密钥 · 🧠 多模型支持 · ⚡ 一键生成</strong>
</p>

---

*一个轻量级、无后端的 Chrome 浏览器插件，利用大语言模型帮助求职者在 BOSS 直聘上智能分析岗位、生成个性化打招呼话术，并在聊天中实时辅助回复。*

</div>

## ✨ 核心功能

### 📊 岗位深度分析
在职位详情页一键分析 JD，AI 自动识别：
- **岗位亮点** — 值得关注的优势
- **潜在风险** — 隐藏的暗坑信号（模糊职责、薪资面议、急招等）
- **信息盲区** — JD 未明确但应主动询问的关键问题
- **匹配建议** — 你应该重点突出的能力方向

### 💬 智能打招呼
基于岗位分析结论 + 你的简历，生成**50-80字**的精准开场白：
- 🎯 强制针对 JD 痛点，不是简历复读机
- 🗣️ 聊天口语风格，拒绝"Dear HR"式书面体
- 🇨🇳 纯中文输出，无论 JD 是否含英文

### 🤝 聊天实时辅助
在 BOSS 直聘聊天界面中，自动读取对话上下文，提供四种意图回复：

| 按钮 | 场景 | 说明 |
|:---:|:---:|:---|
| ⚡ 智能回复 | 日常对话 | 根据 HR 最新消息生成自然回复 |
| 💰 委婉谈薪 | 薪资沟通 | 不卑不亢地争取合理薪资空间 |
| 🛡️ 解释原因 | 敏感话题 | 正面回应离职原因、空窗期等 |
| 👋 高情商拒绝 | 婉拒岗位 | 礼貌结束沟通，保留未来可能 |

> 🔗 **智能关联**：在职位详情页做过的 JD 分析，会自动带入聊天页作为回复的背景上下文

### 📎 简历上传
支持 **PDF** 和 **Word (.docx)** 格式的简历文件：
- 本地纯前端解析，不上传任何文件到服务器
- 使用 Mozilla 的 `pdf.js` 和 `mammoth.js`
- 毫秒级提取，零网络开销

## 🛠️ 技术栈

| 层级 | 技术 |
|:---|:---|
| 前端框架 | React 18 + TypeScript |
| 样式系统 | Tailwind CSS 3 + Shadow DOM 隔离 |
| 构建工具 | Vite 5 + CRXJS (Chrome MV3) |
| 图标库 | Lucide React |
| PDF 解析 | pdfjs-dist (Mozilla) |
| Word 解析 | mammoth.js |
| 扩展架构 | Chrome Manifest V3 + Service Worker |

## 🔑 BYOK 架构（自带密钥）

BOSS Agent 采用 **Bring Your Own Key** 架构：
- ✅ 所有 API 调用直接从你的浏览器发出
- ✅ 简历和聊天记录仅存储在本地 `chrome.storage`
- ✅ 不存在任何中间服务器
- ✅ 支持任意 OpenAI 兼容接口

### 内置供应商快捷配置

| 供应商 | 模型 | 特点 |
|:---|:---|:---|
| DeepSeek | deepseek-chat | 🇨🇳 国产最强性价比 |
| OpenAI | gpt-4o | 🌍 全球旗舰 |
| Kimi (Moonshot) | moonshot-v1-8k | 📚 长文本能力突出 |
| 通义千问 (Qwen) | qwen-max | 🏢 阿里系顶流 |
| 自定义 | 任意 | 🔧 兼容所有 OpenAI 格式的接口 |

## 📦 安装与使用

### 1. 克隆与构建

```bash
# 克隆仓库
git clone https://github.com/Matall725/bossboss.git
cd bossboss

# 安装依赖
npm install

# 构建插件
npm run build
```

### 2. 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启右上角 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择项目中的 **`dist`** 文件夹

### 3. 配置

1. 点击浏览器右上角的 BOSS Agent 图标
2. 选择供应商或填写自定义 API 地址
3. 填入你的 API Key
4. 粘贴或上传你的基础简历

### 4. 开始使用

| 页面 | 功能 |
|:---|:---|
| 职位详情页 (`job_detail`) | 右下角浮窗：分析岗位 → 生成打招呼 |
| 聊天页 (`web/geek/chat`) | 右下角浮窗：四种意图的智能回复 |

## 📁 项目结构

```
bossboss/
├── manifest.json              # Chrome MV3 配置
├── index.html                 # Popup 入口 HTML
├── vite.config.ts             # Vite + CRXJS 构建配置
├── tailwind.config.js         # Tailwind CSS 配置
├── postcss.config.js          # PostCSS 配置
├── public/
│   └── pdf.worker.mjs         # PDF.js Worker 文件
├── src/
│   ├── popup/                 # 插件设置弹窗
│   │   ├── index.tsx          # Popup 入口
│   │   └── Settings.tsx       # 设置页面组件
│   ├── background/            # Service Worker 后台
│   │   ├── index.ts           # 消息路由
│   │   └── llm.ts             # LLM 调用 & Prompt 引擎
│   ├── content/               # 注入页面的内容脚本
│   │   ├── index.tsx          # 职位详情页入口
│   │   ├── chat-assistant.tsx # 聊天页入口
│   │   ├── extractor.ts       # JD 信息提取器
│   │   ├── chatExtractor.ts   # 聊天记录提取器
│   │   ├── components/
│   │   │   ├── PitchPanel.tsx # 岗位分析 + 打招呼面板
│   │   │   └── ChatPanel.tsx  # 聊天辅助面板
│   │   └── css/
│   │       └── index.css      # Tailwind 入口样式
│   ├── utils/
│   │   ├── storage.ts         # Chrome Storage 封装
│   │   └── fileParser.ts      # PDF/Word 本地解析
│   └── styles/
│       └── tailwind.css       # Popup 全局样式
└── dist/                      # 构建产物（加载此文件夹）
```

## 🔒 隐私声明

- 所有数据（简历、API Key、聊天记录）仅存储在本地浏览器的 `chrome.storage.local` 中
- API 请求直接从你的浏览器发往你配置的模型服务商，不经过任何第三方服务器
- 本插件不收集、不上传、不存储任何用户数据

## 📄 License

MIT License

---

<div align="center">
  <sub>Built with ❤️ for job seekers everywhere</sub>
</div>
