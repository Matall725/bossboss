# BOSS Agent (BOSS 直聘 AI 智能求职插件)

BOSS Agent 是一个轻量级、无后端的 Chrome 浏览器插件，利用人工智能大语言模型（如 DeepSeek 或 OpenAI的GPT），帮助求职者在查看 BOSS 直聘职位JD时智能生成定制化的自我推荐与沟通话术。

## 🌟 核心特性

- 🔒 **BYOK (Bring Your Own Key) 架构**: 所有数据交互全部依靠本地浏览器与外部 AI 提供商（避免额外的服务端存储）。
- 📝 **专属基础简历池**: 在本地插件配置页面维护自己的完整基础简历（无字数与格式约束）。
- ⚡ **智能场景触发**: 一键智能读取岗位描述 (JD) 提取关键需求，并匹配你的基础简历。
- 🛡️ **轻量无痕与 Shadow DOM**: 使用 Shadow DOM 与宿主页面的样式强隔离，不扰乱 BOSS 直聘原生页面的展示。
- 🤖 **支持多厂商 LLM**: 内置支持 DeepSeek 和 OpenAI 接口接入。

## 🛠️ 技术栈

- React (Popup 设置前端)
- Tailwind CSS (前端样式设计)
- Vite + CRXJS (高速构建与 Chrome MV3 框架支持)
- TypeScript (强类型支持与编译时审查)

## 📦 如何安装与使用

### 1. 安装项目及开发依赖

如果你要修改代码，请确保提前安装好 `Node.js`。

```bash
# 1. 克隆代码
git clone https://github.com/Matall725/bossboss.git

# 2. 进入目录
cd bossboss

# 3. 安装依赖
npm install

# 4. 构建插件代码 (将在目录下生成 dist 文件夹)
npm run build
```

### 2. 在 Chrome 中加载扩展程序
1. 打开 Chrome 浏览器，在地址栏输入 `chrome://extensions/` 打开扩展程序管理页面。
2. 开启右上角的 **开发者模式 (Developer Mode)**。
3. 点击左上角的 **加载已解压的扩展程序 (Load unpacked)**。
4. 选择我们项目构建出来的 `dist` 文件夹，即可完成加载！

### 3. 开始使用
1. 点击浏览器右上角的插件图标开出设置弹窗。
2. 配置你的 **LLM 提供商**（默认 DeepSeek）及 **API Key**。
3. 粘贴你的专属 **Base Resume (基础简历)** 并自动保存。
4. 打开并在网页上正常浏览 BOSS 直聘的任意**职位详情页** (`job_detail`)，页面右下角将悬浮出一个 **"Generate Pitch"** 按钮，点击即可实时根据 JD 个性化定制推荐语！

## 📄 设计方案
详细的插件架构、设计与实现推演记录可在此查阅：
[设计规范文档](./docs/superpowers/specs/2026-06-02-boss-resume-assistant-design.md)
