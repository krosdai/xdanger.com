import type { Element, ElementContent, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * 给「短强调引用」打上 `pull` class，让 `.prose blockquote.pull`（衬线 + accent 左线）生效。
 *
 * markdown 的 `>` 只生成无 class 的 `<blockquote>`，作者无法手选 calm / pull 两档。这里按
 * 形态自动判定：**单段、无列表/代码/嵌套块、且正文足够短** → pull；其余（多段、含列表的长
 * 数据引用等）保持默认 calm（等宽 + 灰线）。判据贴合 design system 对两档的定义（short
 * pull-quote vs long excerpt），且不必改 `_posts/` / `_notes/` 正文。
 */
const MAX_PULL_LENGTH = 240; // 码点数；超过则视为长引用，留在 calm 档

function collectText(nodes: readonly ElementContent[]): string {
  let out = "";
  for (const node of nodes) {
    if (node.type === "text") out += node.value;
    else if (node.type === "element") out += collectText(node.children);
  }
  return out;
}

export const rehypePullQuotes: Plugin<[], Root> = () => (tree) => {
  visit(tree, "element", (node: Element) => {
    if (node.tagName !== "blockquote") return;

    const blocks = node.children.filter((c): c is Element => c.type === "element");
    // 仅单个 <p> 的引用才可能是 pull——多段 / 含列表 / 含代码块的长引用一律 calm。
    if (blocks.length !== 1 || blocks[0].tagName !== "p") return;
    // 先压缩连续 whitespace 为单空格并 trim，再按码点计数——否则 markdown 软换行 / 多空格
    // 等格式性空白会被计入，让「内容相同、排版不同」的引用落到不同档位。
    // oxlint-disable-next-line typescript/no-misused-spread -- 刻意按码点计数，emoji 被拆成多个码点对长度分档无碍
    const textLength = [...collectText(node.children).replace(/\s+/g, " ").trim()].length;
    if (textLength > MAX_PULL_LENGTH) return;

    const props = node.properties;
    const existing = Array.isArray(props.className)
      ? props.className.map(String)
      : props.className
        ? [String(props.className)]
        : [];
    if (!existing.includes("pull")) existing.push("pull");
    props.className = existing;
  });
};
