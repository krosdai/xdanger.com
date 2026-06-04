import * as fs from "node:fs";
import { WEBMENTION_API_KEY } from "astro:env/server";
import type { WebmentionsCache, WebmentionsChildren, WebmentionsFeed } from "@/types";

const DOMAIN = import.meta.env.SITE;
const CACHE_DIR = ".data";
const filePath = `${CACHE_DIR}/webmentions.json`;
const validWebmentionTypes = ["like-of", "mention-of", "in-reply-to"];

const hostName = new URL(DOMAIN).hostname;

/**
 * 仅放行 http(s) 链接，过滤 `javascript:` 等可执行协议。
 * 非法或空值返回 undefined，让 Astro 直接省略 href 属性。
 */
export function safeHref(url?: string | null): string | undefined {
  return url && /^https?:\/\//i.test(url) ? url : undefined;
}

/**
 * 仅放行 ISO-8601 时间戳。`lastFetched` 来自本地缓存文件，拼进 `since`
 * 前先收敛成受控格式：缓存被篡改/损坏时直接走全量拉取，而非把任意文件内容外发。
 * 小数秒限定 1–9 位，避免被构造成超长 URL；并要求能解析成真实日期。
 */
function isIsoTimestamp(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    return false;
  }
  return !Number.isNaN(Date.parse(value));
}

// Calls webmention.io api.
async function fetchWebmentions(timeFrom: string | null, perPage = 1000) {
  if (!DOMAIN) {
    console.warn("No domain specified. Please set in astro.config.ts");
    return null;
  }

  if (!WEBMENTION_API_KEY) {
    console.warn("No webmention api token specified in .env");
    return null;
  }

  let url = `https://webmention.io/api/mentions.jf2?domain=${hostName}&token=${WEBMENTION_API_KEY}&sort-dir=up&per-page=${perPage}`;

  if (timeFrom && isIsoTimestamp(timeFrom)) url += `&since=${encodeURIComponent(timeFrom)}`;

  const res = await fetch(url);

  if (res.ok) {
    const data = (await res.json()) as WebmentionsFeed;
    return data;
  }

  return null;
}

// Merge cached entries [a] with fresh webmentions [b], merge by wm-id
function mergeWebmentions(a: WebmentionsCache, b: WebmentionsFeed): WebmentionsChildren[] {
  return Array.from(
    [...a.children, ...b.children]
      .reduce((map, obj) => map.set(obj["wm-id"], obj), new Map())
      .values(),
  );
}

// filter out WebmentionChildren
export function filterWebmentions(webmentions: WebmentionsChildren[]) {
  return webmentions.filter((webmention) => {
    // make sure the mention has a property so we can sort them later
    if (!validWebmentionTypes.includes(webmention["wm-property"])) return false;

    // make sure 'mention-of' or 'in-reply-to' has text content.
    if (webmention["wm-property"] === "mention-of" || webmention["wm-property"] === "in-reply-to") {
      return webmention.content && webmention.content.text !== "";
    }

    return true;
  });
}

// save combined webmentions in cache file
function writeToCache(data: WebmentionsCache) {
  const fileContent = JSON.stringify(data, null, 2);

  // create cache folder if it doesn't exist already
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }

  // write data to cache json file
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) throw err;
    console.log(`Webmentions saved to ${filePath}`);
  });
}

function getFromCache(): WebmentionsCache {
  const emptyCache: WebmentionsCache = { lastFetched: null, children: [] };

  if (!fs.existsSync(filePath)) return emptyCache;

  // 缓存损坏/非法 JSON 时退化为全量拉取，而非让异常冒泡中断构建。
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as WebmentionsCache;
  } catch (err) {
    console.warn(`Webmentions cache unreadable, falling back to full fetch: ${err}`);
    return emptyCache;
  }
}

async function getAndCacheWebmentions() {
  const cache = getFromCache();
  const mentions = await fetchWebmentions(cache.lastFetched);

  if (mentions) {
    mentions.children = filterWebmentions(mentions.children);
    const webmentions: WebmentionsCache = {
      lastFetched: new Date().toISOString(),
      // Make sure the first arg is the cache
      children: mergeWebmentions(cache, mentions),
    };

    writeToCache(webmentions);
    return webmentions;
  }

  return cache;
}

let webMentions: WebmentionsCache;

export async function getWebmentionsForUrl(url: string) {
  if (!webMentions) webMentions = await getAndCacheWebmentions();

  return webMentions.children.filter((entry) => entry["wm-target"] === url);
}
