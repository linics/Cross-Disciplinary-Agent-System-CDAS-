# Cross-Disciplinary Agent System (CDAS)

基于 Next.js 16（App Router）与 TypeScript 的多智能体作业平台雏形。当前完成了项目初始化与核心依赖安装，后续步骤将围绕多学科作业生成与评测展开。

## 快速开始
1. 安装依赖（已在模板中生成 `package-lock.json`）：
   ```bash
   npm install
   ```
2. 启动开发服务器：
   ```bash
   npm run dev
   ```
   打开 [http://localhost:3000](http://localhost:3000) 查看页面。

## 环境变量
在项目根目录创建 `.env.local`（已提供占位结构）：
```
SUPABASE_URL=https://your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=homework-images
OPENAI_API_KEY=your-openai-api-key
```

## 数据库 Schema
Supabase 所需的表结构已整理在 [`supabase/schema.sql`](supabase/schema.sql) 中，包括作业存储与提交评测两张表。

## 主要依赖
- **Next.js 16 / React 19 / TypeScript**：前端与服务端同构基础。
- **Tailwind CSS 4**：快速样式构建。
- **@supabase/supabase-js**：数据库与存储交互。
- **openai**：AI 生成与评测能力。
- **zod**：输入/输出校验。

后续步骤将按照 `agents.md` 中的实施蓝图继续完善 API 与前端交互。
