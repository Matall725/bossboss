# BOSS Agent LLM API 通用化改造设计规范

## 1. 目标
去掉当前硬编码的 DeepSeek / OpenAI 双平台枚举逻辑，改为用户自定义 API Base URL + Model 名称 + API Key 的通用接入方式，使插件可以对接任何兼容 OpenAI Chat Completions 格式的大模型服务商。

## 2. 涉及文件与改动

### 2.1 src/utils/storage.ts
- 去掉 `provider` 字段（旧：`"openai" | "deepseek" | "custom"`）
- `baseUrl` 改为必填字段（旧为可选），默认值 `https://api.deepseek.com/v1/chat/completions`
- 新增 `model` 字段（string），默认值 `deepseek-chat`

新接口定义：
```typescript
interface UserSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
  baseResume: string;
}
```

### 2.2 src/background/llm.ts
- 去掉所有 `settings.provider` 相关的 if-else 分支
- URL 直接使用 `settings.baseUrl`
- model 直接使用 `settings.model`

### 2.3 src/popup/Settings.tsx
- 去掉 Provider 下拉框
- 新增 API URL 文本输入框（placeholder 示例：`https://api.deepseek.com/v1/chat/completions`）
- 新增 Model 文本输入框（placeholder 示例：`deepseek-chat`）
- 字段顺序：API URL > API Key > Model > Base Resume

## 3. 兼容性说明
以下平台均兼容 OpenAI `/v1/chat/completions` 格式，用户只需填写对应的 URL 和 Model 即可使用：
- DeepSeek: `https://api.deepseek.com/v1/chat/completions` / `deepseek-chat`
- OpenAI: `https://api.openai.com/v1/chat/completions` / `gpt-4o-mini`
- Kimi (Moonshot): `https://api.moonshot.cn/v1/chat/completions` / `moonshot-v1-8k`
- 智谱 (Zhipu): `https://open.bigmodel.cn/api/paas/v4/chat/completions` / `glm-4-flash`
- 硅基流动 (SiliconFlow): `https://api.siliconflow.cn/v1/chat/completions` / `deepseek-ai/DeepSeek-V3`
- Ollama 本地: `http://localhost:11434/v1/chat/completions` / `qwen2`

## 4. 默认值策略
为保证开箱即用体验，默认值设为 DeepSeek（国内用户最常见且性价比最高的选择）。用户安装后只需填一个 API Key 即可立刻使用，无需了解 URL 和 Model 的概念。
