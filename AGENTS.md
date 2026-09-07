# AGENTS.md

面向 AI 编码代理的项目说明。阅读本文前无需了解本项目的任何背景。

## 项目概览

**geek-homepage-frontend** 是一个个人数字花园（Digital Garden）主页的前端，标题为 "Geek System Core"，副标题 "AI Powered Digital Garden"。它是一个纯前端项目：所有业务数据（笔记、知识图谱、AI 对话）都通过 HTTP 请求转发到独立部署的后端服务，本仓库不包含任何后端代码。

主要功能：

- **主控台（`/`）**：左侧为 2D 知识图谱可视化（`react-force-graph-2d`），右侧为 AI 对话助手。
- **全部知识（`/notes`）**：笔记列表 + 发布框。发布框由 Supabase 登录态控制，仅硬编码的管理员邮箱可见。
- **笔记详情（`/notes/[id]`）**：渲染后端返回的 HTML 笔记内容（TipTap 编辑产出的 HTML）。
- **登录（`AuthModal`）**：Supabase Auth 邮箱密码登录/注册，仅用于控制发布权限。

UI 为暗色"极客终端"风格：深灰底色（`#0a0a0a` / `#121212`）+ 橙色（`orange-500`）主题色，大量等宽字体（`font-mono`）文案。

## 技术栈

- **框架**：Next.js 16.3.0（App Router），React 19.2.8，TypeScript（strict 模式）
- **样式**：Tailwind CSS v4（通过 `@tailwindcss/postcss`，配置见 `src/app/globals.css` 的 `@theme`）+ `@tailwindcss/typography`（`prose` 类渲染笔记 HTML）
- **富文本**：TipTap v3（`@tiptap/react` + `starter-kit` + `code-block-lowlight`，代码高亮用 `lowlight`/`highlight.js` 的 atom-one-dark 主题）
- **鉴权**：Supabase（`@supabase/ssr` 的 `createBrowserClient`，纯客户端使用）
- **图谱**：`react-force-graph-2d`（需禁用 SSR，`next/dynamic` + `ssr: false`）
- **Lint**：ESLint 9 + `eslint-config-next`（core-web-vitals + typescript 预设）

注意：`tailwind.config.ts` 仍保留了 Tailwind v3 风格的配置（含一条中文注释），但实际生效的是 v4 的 CSS 配置，该文件可能是历史遗留，修改样式时以 `globals.css` 为准。

## 目录结构

```
src/
├── app/                  # Next.js App Router 页面
│   ├── layout.tsx        # 根布局：固定左侧 Sidebar + 主内容区，Inter 字体
│   ├── page.tsx          # 主控台（知识图谱 + AI 对话）
│   ├── globals.css       # Tailwind v4 入口 + TipTap/ProseMirror 定制样式
│   └── notes/
│       ├── page.tsx      # 笔记列表（含管理员发布框）
│       └── [id]/page.tsx # 笔记详情
├── components/
│   ├── Sidebar.tsx       # 固定侧边栏：导航、模拟目录树、登录入口
│   ├── AuthModal.tsx     # Supabase 登录/注册弹窗
│   ├── ChatBox.tsx       # AI 对话组件
│   ├── KnowledgeGraph.tsx# 知识图谱可视化
│   └── BlockEditor.tsx   # TipTap 块编辑器（发布笔记用）
├── utils/supabase/client.ts  # Supabase 浏览器客户端工厂
└── config.ts             # API_BASE_URL（后端地址）
```

关键配置：`tsconfig.json` 中路径别名 `@/*` → `./src/*`；`src/config.ts` 硬编码后端地址 `https://xiqiaobackend.zeabur.app`。

## 运行与构建

```bash
npm run dev    # 开发服务器（http://localhost:3000）
npm run build  # 生产构建
npm run start  # 启动生产构建
npm run lint   # ESLint
```

无测试框架、无测试文件，测试策略目前为空。`next build`（含 TypeScript 类型检查）是仅有的通过式质量门禁；注意 **`npm run lint` 当前存在 14 处既有告警（10 errors / 4 warnings），基线是失败的**，详见下文"已知问题"。

## 环境变量

在 `.env.local` 中配置（已被 `.gitignore` 忽略，不可提交）：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

缺失时 Supabase 相关功能（登录、发布权限门控）会静默失效。

## 架构要点与约定

- **纯客户端数据获取**：几乎所有页面/组件都是 `"use client"`，在 `useEffect` 里用 `fetch` 直连后端，没有用 Next.js 的 Server Component / Route Handler 做数据层。后端 API 约定：
  - `GET/POST {API_BASE_URL}/api/v1/notes/` — 笔记列表/发布（POST body 含 `content` 与 `metadata: { source: "web_client", format: "html" }`）
  - `GET {API_BASE_URL}/api/v1/notes/{id}` — 单条笔记
  - `GET {API_BASE_URL}/api/v1/graph/` — 知识图谱 `{ nodes, links }`
  - `POST {API_BASE_URL}/api/v1/chat/` — AI 对话（body: `{ question }`，返回 `{ answer }`）
- **笔记内容是 HTML 而非 Markdown**：由 TipTap 生成，渲染时直接用 `dangerouslySetInnerHTML` 配合 `prose prose-invert prose-orange`。后端信任边界需注意：渲染的 HTML 来自后端/管理员输入，本前端不做任何消毒（sanitize）。
- **权限门控在前端**：`src/app/notes/page.tsx` 中硬编码 `ADMIN_EMAIL = "2377392781@qq.com"`，仅当 Supabase 会话邮箱匹配时才显示发布框——这是纯 UI 层面的隐藏，后端必须自行校验写权限，不能依赖前端。
- **语言与文案**：`html lang="zh-CN"`，UI 文案和代码注释以中文为主，风格刻意使用终端/赛博梗（如 `Commit /`、`cd ..`、`Decrypting memory...`）。新代码请延续这一风格。
- **图标**：使用内联手写 SVG（Heroicons 路径风格），未引入图标库。

## 已知问题

`npm run lint` 当前基线为 14 problems（10 errors / 4 warnings），均为既有代码问题，修改相关文件时建议顺手修复：

- `tailwind.config.ts:18` — 使用 `require()` 导入插件（`@typescript-eslint/no-require-imports`）。
- `src/components/KnowledgeGraph.tsx` — 3 处 `no-explicit-any`（`GraphData` 的 `nodes`/`links` 与 `linkWidth` 回调），以及 `setIsMounted(true)` 在 effect 内同步调用 state（`react-hooks/set-state-in-effect`）。
- `src/components/AuthModal.tsx` — `catch (error: any)`（`no-explicit-any`）+ 未使用的 `import { findSourceMap } from "module"` 残留。
- `src/app/notes/page.tsx` — 未使用的 `import { format } from "path"` 残留 + `react-hooks/exhaustive-deps` 警告（`fetchNotes`/`checkAuth` 未列入依赖数组）。
- `src/app/notes/[id]/page.tsx` — `catch (err: any)`（`no-explicit-any`）+ 同类 `exhaustive-deps` 警告。

其他：

- `Sidebar.tsx` 的目录树是硬编码的模拟数据（注释中注明"未来可以从后端 API 动态获取"）。
- `tailwind.config.ts` 整体疑似 Tailwind v3 遗留（见"技术栈"一节），未被实际使用。

## 部署

标准 Next.js 项目，预期部署在 Vercel（README 为 create-next-app 默认说明）。后端是独立部署在 Zeabur 的服务，前端构建不依赖后端可用性，但运行时页面功能依赖后端在线。
