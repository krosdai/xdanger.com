# xdanger.com

这是 [xdanger.com](https://xdanger.com/) 个人博客网站的源代码仓库，使用 [Astro](https://astro.build/) 框架构建。

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

- [mise](https://mise.jdx.dev/)（统一管理工具链：Node、pnpm、AutoCorrect CLI，见 `mise.toml`）
- [Node.js](https://nodejs.org/) ≥ 22.12（`mise.toml` / `.nvmrc` 锁定 Node 24）
- [pnpm](https://pnpm.io/) 11.7.0（`packageManager` 与 `mise.toml` 锁定同一版本：Corepack 与 mise shim 不冲突）

### 安装依赖

```bash
mise trust     # 首次 clone 后信任仓库的 mise.toml（CI / 非交互环境必需）
mise install   # 安装锁定的工具链（Node、pnpm、AutoCorrect CLI），或 mise run setup
pnpm install
```

> `pnpm lint`/`fix` 会调用 `mise run autocorrect:*`，因此需要 `mise` 在 `PATH` 上（先跑一次 `mise install`）。

### 开发命令

| 命令                  | 说明                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`            | 启动开发服务器                                                                                                           |
| `pnpm build`          | 构建生产版本，并生成 Pagefind 搜索索引                                                                                   |
| `pnpm build:site`     | 只运行 Astro 构建，适合本地快速验证                                                                                      |
| `pnpm build:debug`    | 带 `NODE_OPTIONS=--trace-warnings` 运行 Astro 构建                                                                       |
| `pnpm run rebuild`    | 只重新执行 Astro 构建，复用已有 OG image PNG，只补缺失图片                                                               |
| `pnpm run rebuild:og` | 强制刷新全部 OG image PNG，并写回本地缓存                                                                                |
| `pnpm preview`        | 用 `scripts/preview-server.mjs`（忠实复刻线上 `try_files $uri $uri/index.html =404`）伺服 `dist/`，1:1 复现线上 URL 行为 |
| `pnpm lint`           | 运行 autocorrect / oxfmt / prettier / oxlint / astro check 全套检查                                                      |
| `pnpm fix`            | 自动修复格式与可修复的 lint 问题                                                                                         |

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

本项目以「干净 URL 为默认、冻结的历史文章为例外」组织所有地址；新增内容时以
`src/utils/url.ts`（`getPostPath` / `getPostRouteSlug` / `getCanonicalUrl` / `getNotePath`，单一事实来源）为准：

1. MoveableType 时期的文章（发布日期 < `2013-05-31`）：
   - 文件路径：`_posts/YYYY/MM/DD/SEQ.mdx`
   - URL 形态：`/YYYY/MM/DD/SEQ.html`（与原博客完全一致）

2. Jekyll 时期的文章（`2013-05-31` <= 发布日期 < `2025-02-28`）：
   - 文件路径：`_posts/YYYY/MM/DD/title.mdx`
   - URL 形态：`/YYYY/MM/DD/title.html`（与原博客完全一致）

3. Astro 时期的文章（`2025-02-28` <= 发布日期）：
   - 文件路径：`_posts/YYYY/MMDD-title.mdx`
   - URL 形态：`/title-YYYYMMDD`（干净 URL，slug 取自文件名 `MMDD-` 之后那段，日期取自 `YYYY`+`MMDD`）
   - 历史上短暂用过的 `/YYYY/MMDD-title`（无后缀）及更早 `/YYYY/MMDD-title.html` 形态，统一重定向到此形态（机制见下）

4. 笔记（notes）：
   - 文件路径：`_notes/<YYYY>/<MMDD>-<slug>.md`（按年分目录、日期前缀，与文章 Astro 期对齐）
   - URL 形态：`/notes/<slug>-<YYYYMMDD>`（干净 URL，日期取自路径，时区无关；文件名不符合约定会导致构建失败）

实现机制：`build.format: "directory"` 让每个页面默认输出为 `<path>/index.html`（干净 URL）；
历史文章（①②）在 `astro:build:done` 钩子（`astro.config.ts` 的 `legacyHtmlFlattener`）里被还原成
扁平 `<path>.html` 文件，以原样伺服历史 `.html` 链接。

重定向（③/旧 `.html` → ④、旧笔记 → 新）走双层：`astro.config.ts` 的 `redirects` 在静态产物里生成带
`canonical` + `noindex` 的 **meta-refresh 桩**（200 HTML，供 GitHub Pages 等任意静态 host 兜底）；
`vercel.json` 的 `redirects` 在 Vercel 上把同样的源升级为真正的 **308 永久重定向**。两处源/目标须保持一致。

整套 URL 契约都写在静态产物 + 一份可移植的重定向规则里，因此任意静态 host 行为一致、可迁移。本地
`pnpm preview`（`scripts/preview-server.mjs`）按 `try_files $uri $uri/index.html =404` 伺服 `dist/`，
并读取 `vercel.json` 的 `redirects` 复现 Vercel 的 308，即可 1:1 复现线上的链接 / 跳转 / 404。
注意不要用 `astro preview`（带路由魔法：对重定向发 3xx、对历史无后缀做 `.html` 回退），不反映线上。

### 工具链

- **工具链管理**：[mise](https://mise.jdx.dev/)（`mise.toml`，锁定 Node / pnpm / AutoCorrect CLI）
- **包管理器**：pnpm（`packageManager` 字段与 `mise.toml` 同步锁定 11.7.0）
- **TypeScript/JS 格式化**：[Oxfmt](https://oxc.rs/docs/guide/usage/formatter)（`.oxfmtrc.jsonc`，Prettier 兼容输出）
- **其余格式化**：Prettier (含 `prettier-plugin-astro` / `prettier-plugin-tailwindcss`)，负责 `.astro` / JSON / YAML / CSS 等（**不含 Markdown**）
- **TypeScript/JS lint**：[Oxlint](https://oxc.rs/docs/guide/usage/linter)（type-aware，经 `oxlint-tsgolint`，`.oxlintrc.json`）
- **中文文本规范 + Markdown 格式化**：[AutoCorrect](https://github.com/huacnlee/autocorrect)（经 mise 安装；`.md`/`.mdx` 的唯一格式化工具）
- **类型检查**：`astro check`

### 重要文件

- `AGENTS.md` - 给所有 AI 编程助手的规范说明
- `docs/20250413_migration.md` - 包含从 Next.js 迁移到 Astro 的完整过程记录和待办事项
- `astro.config.ts` - Astro 配置文件
- `src/site.config.ts` - 网站核心配置
- `src/utils/url.ts` - URL 格式处理工具函数

### 部署

- **Vercel**（主站）：`vercel.json` 设 `cleanUrls: false`，并用 `redirects` 把 ③/旧 `.html`/旧笔记升级为 308 永久重定向；URL 规则由静态产物承载，重定向规则可移植到其它 host（如 Netlify `_redirects`、nginx）。
- **GitHub Pages**（备份）：通过 `.github/workflows/deploy.yml` 在 `main` 推送后自动构建并发布，行为与 Vercel 一致。

## TODO

### SSG 模式下的改进

- [x] 深入解决 URL 的处理，让生成的 URL 合理，让内链的 URL 符合预期
- [x] 确保 linter/formatter 正确有效（已统一为 oxfmt + prettier + oxlint + autocorrect + astro check）
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

本仓库采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 授权，详见
[`LICENSE`](./LICENSE)。第三方依赖和 `public/assets/` 中保留的第三方素材仍遵循其各自的上游许可。
