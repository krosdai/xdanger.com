import type { CollectionEntry } from "astro:content";

// 定义历史时期的分界日期
export const JEKYLL_START_DATE = new Date("2013-05-31");
export const ASTRO_START_DATE = new Date("2025-02-28");

/**
 * 判断文章属于哪个历史时期
 * @param publishDate 文章发布日期
 * @returns 文章所属的历史时期
 */
export function getBlogEra(publishDate: Date): "moveabletype" | "jekyll" | "astro" {
  if (publishDate < JEKYLL_START_DATE) {
    return "moveabletype";
  }
  if (publishDate < ASTRO_START_DATE) {
    return "jekyll";
  }
  return "astro";
}

/**
 * 判断是否为新 URL 格式 (Astro 时期的文章)
 */
export function isAstroEraPost(post: CollectionEntry<"post">): boolean {
  return post.data.publishDate >= ASTRO_START_DATE;
}

/**
 * 根据文章 ID 获取正确的路径
 * 用于内部链接、导航等
 * @param post 文章对象
 * @returns 正确格式的路径
 */
export function getPostPath(post: CollectionEntry<"post">): string {
  const postId = post.id.startsWith("/") ? post.id.substring(1) : post.id;

  // 在内部导航中应当保持历史连接格式，以保持 URL 向后兼容
  // if (era === "moveabletype" || era === "jekyll") {
  //   // MoveableType 和 Jekyll 时期的文章链接应当带有.html 后缀
  //   return `/${postId}.html`;
  // }
  // Astro 时期的文章使用无后缀形式
  return `/${postId}.html`; // 改成所有 post 都带 `.html` 后缀
}

/**
 * 根据发布日期决定文章的规范 URL 格式
 * 用于 canonical 和外部链接
 * @param post 文章对象
 * @returns 规范化的 URL 路径
 */
export function getCanonicalUrl(post: CollectionEntry<"post">): string {
  const siteUrl = import.meta.env.SITE;
  return `${siteUrl}/${getPostPath(post)}`;
}
