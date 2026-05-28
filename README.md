# xdanger.com

这是 [xdanger.com](https://www.xdanger.com/) 个人博客网站的源代码仓库，使用 [Astro](https://astro.build/) 框架构建。

> AI agents (Claude Code, Codex, Cursor 等) 请阅读 [`AGENTS.md`](./AGENTS.md) 获取项目规范。

## 项目概述

- 基于 [Astro](https://astro.build/) v6 框架构建的静态博客网站
- 使用 `pnpm` 作为包管理器
- 支持 MDX 格式的博客文章和笔记
- 集成了 Tailwind CSS v4 进行样式管理
- 通过 Pagefind 提供站内搜索
- 包含博客文章、笔记和标签页面

## 开发指南

### 系统要求

- [Node.js](https://nodejs.org/) ≥ 20.19（推荐 Node 22 LTS，见 `.nvmrc`）
- [pnpm](https://pnpm.io/) ≥ 10（通过 [Corepack](https://nodejs.org/api/corepack.html) 自动启用）

### 安装依赖

```bash
pnpm install
```

### 开发命令

| 命令            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| `pnpm dev`      | 启动开发服务器                                               |
| `pnpm build`    | 构建生产版本（构建后自动运行 `pagefind`）                    |
| `pnpm preview`  | 预览构建后的网站                                             |
| `pnpm lint`     | 运行 autocorrect / prettier / eslint / astro check 全套检查 |
| `pnpm fix`      | 自动修复格式与可修复的 lint 问题                             |

### 项目结构

- `_posts/` - 博客文章内容 (MDX 格式)
- `_notes/` - 笔记内容 (MDX 格式)
- `src/components/` - 组件
- `src/layouts/` - 页面布局
- `src/pages/` - 页面和路由
- `src/styles/` - 全局样式
- `src/utils/` - 工具函数
- `public/` - 静态资源文件

### URL 规则

本项目包含三种 URL 格式以保持向后兼容性：

1. MoveableType 时期的文章（发布日期 < `2013-05-31`）：

   - 文件路径：`src/content/post/YYYY/MM/DD/SEQ.mdx`
   - 生成的 URL：`/YYYY/MM/DD/SEQ.html`
   - 注意：不带 `.html` 后缀的 URL 将返回 404，这是预期行为

2. Jekyll 时期的文章 (`2013-05-31` <= 发布日期 < `2025-02-28`)：

   - 文件路径：`src/content/post/YYYY/MM/DD/title.mdx`
   - 生成的 URL：`/YYYY/MM/DD/title.html`（保持与原博客完全一致的 URL 格式）
   - 注意：不带 `.html` 后缀的 URL 将返回 404，这是预期行为

3. Astro 时期的文章 (`2025-02-28` <= 发布日期)：

   - 文件路径：`src/content/post/YYYY/MMDD-title.mdx`
   - 生成的 URL：`/YYYY/MMDD-title`（更简洁的新格式，依赖 Vercel `cleanUrls`）

### 工具链

- **包管理器**：pnpm (`packageManager` 字段已锁定版本)
- **代码格式化**：Prettier (含 `prettier-plugin-astro` / `prettier-plugin-tailwindcss` / `prettier-plugin-autocorrect`)
- **TypeScript/JS lint**：ESLint (flat config，`eslint.config.js`)
- **中文文本规范**：[AutoCorrect](https://github.com/huacnlee/autocorrect)
- **类型检查**：`astro check`

### 重要文件

- `AGENTS.md` - 给所有 AI 编程助手的规范说明
- `MIGRATION.md` - 包含从 Next.js 迁移到 Astro 的完整过程记录和待办事项
- `astro.config.ts` - Astro 配置文件
- `src/site.config.ts` - 网站核心配置
- `src/utils/url.ts` - URL 格式处理工具函数

### 部署

- **Vercel**（主站）：通过 `vercel.json` 配置，启用 `cleanUrls`。
- **GitHub Pages**（备份）：通过 `.github/workflows/deploy.yml` 在 `main` 推送后自动构建并发布。

## TODO

### SSG 模式下的改进

- [x] 深入解决 URL 的处理，让生成的 URL 合理，让内链的 URL 符合预期
- [x] 确保 linter/formatter 正确有效（已统一为 prettier + eslint + autocorrect + astro check）
- [x] Upgrade Astro to v6
- [x] Switch package manager to pnpm (移除 bun / biomejs / deno 工具链)
- [ ] Use Cypress/Playwright to establish an e2e tests framework
- [ ] 整理目录结构和代码，让路由更简单合理
- [ ] 重构页面布局相关的 components，需要更合理封装组件，而不是现在大量复制黏贴
- [ ] 尝试改动页面布局，在大尺寸屏幕上尝试居左，右侧空间留给 TOC

### 另建分支探索 SSR

- [ ] 在本地跑通 SSR，确保 URL 处理正确
- [ ] 在 Vercel 上跑通 SSR

## LICENSE

- 代码部分：遵循 Astro 的 MIT 协议
- 文章内容：采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
