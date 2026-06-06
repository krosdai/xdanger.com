import type { CollectionEntry } from "astro:content";

/**
 * URL 策略的单一事实来源（posts 与 notes）。
 *
 * 文章按 `post.id` 的形态分两类（等价于 README 的发布日期纪元，且时区无关）：
 *
 *  - 历史文章（MoveableType / Jekyll，id 形如 `YYYY/MM/DD/x`）：
 *    URL 保持 `/YYYY/MM/DD/x.html`，与原博客完全一致。
 *
 *  - Astro 期文章（id 形如 `YYYY/MMDD-slug`）：
 *    URL 采用「slug 在前、日期在后」的干净形态 `/slug-YYYYMMDD`
 *    （slug 取自文件名 `MMDD-` 之后那段，日期取自 `YYYY` 目录 + `MMDD` 前缀）。
 *    旧的 `/YYYY/MMDD-slug` 形态由 astro.config.ts 的 `redirects` 301 跳到这里。
 *
 * 产物形态：astro.config.ts 用 `build.format: "directory"`，所有页面默认输出为
 * `<path>/index.html`（干净 URL）。历史文章在 `astro:build:done` 钩子
 * （astro.config.ts 的 `legacyHtmlFlattener`）里被还原成扁平 `<path>.html` 文件，
 * 以原样伺服历史 `.html` 链接。
 *
 * 因此本文件区分两组出口：
 *  - {@link getPostPath} / {@link getCanonicalUrl}：对外链接（内链、canonical、RSS、sitemap），
 *    历史 → `.html`，Astro 期 → 干净 URL。
 *  - {@link getPostRouteSlug}：`getStaticPaths` 用的路由 slug，决定 dist 落盘路径
 *    （历史文章先落在 `<path>/index.html`，再由钩子还原成 `<path>.html`）。
 */

/** 历史文章（MoveableType / Jekyll）：`YYYY/MM/DD/x` */
const LEGACY_POST_RE = /^\d{4}\/\d{2}\/\d{2}\/[^/]+$/;
/** Astro 期文章：`YYYY/MMDD-slug` */
const ASTRO_POST_RE = /^(\d{4})\/(\d{4})-(.+)$/;

function bareId(id: string): string {
  return id.startsWith("/") ? id.slice(1) : id;
}

/** 是否历史文章（URL 保持 `/YYYY/MM/DD/x.html`） */
export function isLegacyPost(post: CollectionEntry<"post">): boolean {
  return LEGACY_POST_RE.test(bareId(post.id));
}

/** Astro 期文章的 ④ 路径（含前导 `/`、无 `.html`）；非 Astro 形态则原样兜底 */
function astroPostPath(id: string): string {
  const bare = bareId(id);
  const match = bare.match(ASTRO_POST_RE);
  if (!match) return `/${bare}`;
  const [, year, mmdd, slug] = match;
  return `/${slug}-${year}${mmdd}`;
}

/** 文章对外规范路径：历史 → `/….html`，Astro 期 → `/slug-YYYYMMDD` */
export function getPostPath(post: CollectionEntry<"post">): string {
  const id = bareId(post.id);
  return isLegacyPost(post) ? `/${id}.html` : astroPostPath(id);
}

/**
 * `getStaticPaths` 的路由 slug（无前导 `/`、无 `.html`）：
 * 历史 → id 原样（落盘后由钩子加 `.html`），Astro 期 → ④ slug。
 */
export function getPostRouteSlug(post: CollectionEntry<"post">): string {
  const id = bareId(post.id);
  return isLegacyPost(post) ? id : astroPostPath(id).slice(1);
}

/**
 * 文章的规范绝对 URL，用于 canonical 与外部链接。
 * 以 `import.meta.env.SITE` 为 base 交给 URL 构造器拼接，避免重复斜杠。
 */
export function getCanonicalUrl(post: CollectionEntry<"post">): string {
  return new URL(getPostPath(post), import.meta.env.SITE).href;
}

/**
 * 笔记命名约定：按年分目录、日期前缀 `YYYY/MMDD-slug`（slug 不含 `/`，与文章 Astro 期同构）。
 * MM 限定 `01–12`、DD 限定 `01–31`，挡掉 `1399` 这类非法日期（避免静默产出错误 URL）。
 */
const ASTRO_NOTE_RE = /^(\d{4})\/((?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))-([^/]+)$/;

/**
 * 笔记 slug（路由 slug 与对外 URL 共用，无前导 `/`、时区无关）。
 *
 * 文件命名约定为 `_notes/<YYYY>/<MMDD>-<slug>.md`（id 形如 `YYYY/MMDD-slug`），
 * 翻成干净的 `<slug>-<YYYYMMDD>`。不符合约定的文件名直接抛错，避免静默产出错误 URL。
 */
function noteSlug(id: string): string {
  const bare = bareId(id);
  const match = bare.match(ASTRO_NOTE_RE);
  if (!match) {
    throw new Error(
      `笔记文件名不符合约定 \`_notes/<YYYY>/<MMDD>-<slug>.md\`：${bare}`,
    );
  }
  const [, year, mmdd, slug] = match;
  return `${slug}-${year}${mmdd}`;
}

/** 笔记的路由 slug（`getStaticPaths` 用，决定 dist 落盘路径）。 */
export function getNoteRouteSlug(note: CollectionEntry<"note">): string {
  return noteSlug(note.id);
}

/**
 * 笔记对外路径：`/notes/<slug>-<YYYYMMDD>`
 * （在 `build.format: "directory"` 下输出为干净 URL）。
 */
export function getNotePath(note: CollectionEntry<"note">): string {
  return `/notes/${noteSlug(note.id)}`;
}
