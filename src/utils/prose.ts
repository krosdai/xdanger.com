/**
 * 文章正文（post 详情 + note 详情）共用的 `prose` 类串——单一事实源。
 *
 * 两处正文容器（src/layouts/BlogPost.astro、src/components/note/Note.astro）此前
 * 各自内联一份逐字相同的长串；改 heading 锚点 `#`、字体、`before:` 颜色时要同步
 * 两处、极易遗漏。抽到这里后，调用方只各自追加宽度约束：post 用 `max-w-3xl`、
 * note 列用 `max-w-none`。
 *
 * 注：这里用 JS 常量而非 `@utility prose-article`，因为串内含 typography 插件的
 * `prose-headings:` 变体；在 Tailwind v4 里 `@apply` 这类插件变体的行为不稳定，
 * 而常量保持原样类名、渲染字节级一致。Tailwind v4 的内容扫描会读到本文件里的
 * 类名 token，工具类照常生成。
 */
export const PROSE_ARTICLE =
  "prose prose-base prose-headings:font-plex-serif-medium prose-headings:font-medium prose-headings:text-accent-2 prose-headings:before:absolute prose-headings:before:-ms-4 prose-headings:before:text-gray-600 dark:prose-headings:before:text-gray-400 prose-headings:hover:before:text-accent sm:prose-headings:before:content-['#'] sm:prose-th:before:content-none";
