import fs from "node:fs";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import type { AstroIntegration } from "astro";
import { defineConfig, envField } from "astro/config";
import { expressiveCodeOptions } from "./src/site.config";
import { siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive"; /* Handle ::: directives as nodes */
import remarkMath from "remark-math";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* Add admonitions */
import { remarkReadingTime } from "./src/plugins/remark-reading-time"; /* Add reading time */

// Rehype plugins
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeUnwrapImages from "rehype-unwrap-images";

// Optional HTTPS for remote debugging over Tailscale via anyip.dev.
// `<dashed-ip>.anyip.dev` resolves back to the embedded IP and anyip publishes a
// real Let's Encrypt wildcard cert for `*.anyip.dev` (private key intentionally
// public — same security as plain HTTP, which is fine since Tailscale already
// encrypts the transport). Drop the cert into `.cert/anyip/` (git-ignored via
// *.pem) and the dev server auto-serves HTTPS so secure-context APIs work:
//   pnpm cert:anyip   # downloads fullchain.pem + privkey.pem into .cert/anyip/
// Then open e.g. https://100-77-4-5.anyip.dev:4321 (your Tailscale IP, dashed).
const anyipCert = "./.cert/anyip/fullchain.pem";
const anyipKey = "./.cert/anyip/privkey.pem";
// Guarded: this also runs during `pnpm build`, so a corrupt/unreadable cert
// must never abort the build — fall back to plain HTTP dev instead.
const devHttps = (() => {
  try {
    if (fs.existsSync(anyipCert) && fs.existsSync(anyipKey)) {
      return { cert: fs.readFileSync(anyipCert), key: fs.readFileSync(anyipKey) };
    }
  } catch {
    // fall through to undefined
  }
  return undefined;
})();

// https://astro.build/config
export default defineConfig({
  // adapter: vercel(),
  // Dev server. Only bind to all interfaces when the anyip cert is present
  // (i.e. you've opted into HTTPS remote debugging over Tailscale). Without the
  // cert, fall back to Astro's localhost-only default so a plain `pnpm dev` is
  // never exposed to the LAN.
  //
  // No `allowedHosts` here: Vite skips its host-header allowlist entirely when
  // the dev server runs over HTTPS (https://vite.dev/config/server-options),
  // so it can't guard this path. DNS-rebinding is instead limited by Vite's
  // default CORS policy (only localhost origins may read responses) plus
  // keeping this all-interfaces bind gated behind the HTTPS opt-in above.
  server: devHttps ? { host: true, port: 4321 } : undefined,
  build: {
    // 干净 URL 默认：每个页面输出为 `<path>/index.html`。历史文章随后由
    // `legacyHtmlFlattener` 钩子还原成扁平 `<path>.html`（见文件底部）。
    // https://docs.astro.build/zh-cn/reference/configuration-reference/#buildformat
    format: "directory",
  },
  image: {
    domains: ["webmention.io"],
  },
  integrations: [
    expressiveCode(expressiveCodeOptions),
    icon(),
    sitemap({
      changefreq: "weekly",
      priority: 0.5,
      // 排除 ③→④ 与旧笔记的重定向桩（只是跳转，不应进 sitemap）
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, "");
        if (/^\/\d{4}\/\d{4}-[^/]+$/.test(path)) return false;
        if (path === "/notes/welcome") return false;
        return true;
      },
      // 历史文章在 sitemap 中输出为 `.html`，与钩子还原后的实际文件保持一致
      serialize: (item) => {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/$/, "");
        if (/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+$/.test(path)) {
          url.pathname = `${path}.html`;
          item.url = url.href;
        }
        return item;
      },
    }),
    mdx(),
    robotsTxt(),
    webmanifest({
      // See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
      name: siteConfig.title,
      short_name: "xdanger", // optional
      description: siteConfig.description,
      lang: siteConfig.lang,
      icon: "public/icon.svg", // the source for generating favicon & icons
      icons: [
        {
          src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
          sizes: "180x180",
          type: "image/png",
        },
        {
          src: "icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      start_url: "/",
      background_color: "#1d1f21",
      theme_color: "#2bbc8a",
      display: "standalone",
      config: {
        insertFaviconLinks: false,
        insertThemeColorMeta: false,
        insertManifestLink: false,
      },
    }),
    // 干净 URL 例外：把历史文章从 `<path>/index.html` 还原成扁平 `<path>.html`
    legacyHtmlFlattener(),
  ],
  markdown: {
    // Astro 6 deprecated the top-level `remarkPlugins`/`rehypePlugins`/`remarkRehype`
    // options. They now live on a `unified({...})` processor from
    // `@astrojs/markdown-remark`. Defaults (gfm, smartypants, syntax highlighting)
    // stay enabled because they're baked into `unified()` itself.
    //
    // NOTE: the `[astro] markdown.*Plugins are deprecated` warning still prints at
    // startup — it comes from astro-expressive-code (≤0.42.0), which injects its
    // rehype plugin via the legacy `markdown.rehypePlugins` channel. It's harmless
    // and will clear once that package migrates to `markdown.processor` upstream.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["not-prose"] } }],
        [
          rehypeExternalLinks,
          {
            rel: ["noreferrer", "noopener"],
            target: "_blank",
          },
        ],
        [rehypeKatex, { strict: true }],
        rehypeUnwrapImages,
      ],
      remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions, remarkMath],
      remarkRehype: {
        footnoteLabelProperties: {
          className: [""],
        },
      },
    }),
  },
  output: "static",
  // 每条 redirect 在静态产物里是一张带 canonical + noindex 的 meta-refresh 桩
  // （200 HTML，供 GitHub Pages 等任意静态 host 兜底）；Vercel 上再由 vercel.json
  // 的 redirects 升级为真正的 308 永久重定向（本地 pnpm preview 也读 vercel.json
  // 复现 308）。两处的源/目标须保持一致。
  redirects: {
    // ③/旧 .html → ④：[2025-02-28, 2026-06-04) 间这两篇 Astro 文章曾以 ③
    // `/YYYY/MMDD-slug`（无后缀）和旧 getPostPath 的 `….html` 形态发布过，一并
    // 重定向到 ④ `/slug-YYYYMMDD`。冻结集，此后新文章直接以 ④ 发布。
    "/2025/0315-multiplanet-civilization-v-earth-gravity":
      "/multiplanet-civilization-v-earth-gravity-20250315",
    "/2025/0315-multiplanet-civilization-v-earth-gravity.html":
      "/multiplanet-civilization-v-earth-gravity-20250315",
    "/2025/0504-berkshire-hathaway": "/berkshire-hathaway-20250504",
    "/2025/0504-berkshire-hathaway.html": "/berkshire-hathaway-20250504",
    // 旧笔记 URL → 新 `<slug>-<YYYYMMDD>` 形态
    "/notes/welcome": "/notes/welcome-20250514",
  },
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  site: siteConfig.url,
  // https://docs.astro.build/zh-cn/reference/configuration-reference/#trailingslash
  trailingSlash: "never",
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [tailwindcss(), rawFonts([".ttf", ".woff"])],
    // `devHttps` is undefined unless the anyip cert is present, so this is a
    // no-op for normal local dev and only flips the dev server to HTTPS when
    // you've downloaded the cert (see the note near the top of this file).
    server: {
      https: devHttps,
    },
  },
  env: {
    schema: {
      WEBMENTION_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      WEBMENTION_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      WEBMENTION_PINGBACK: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
});

/**
 * `build.format: "directory"` 把每个页面输出为 `<path>/index.html`（干净 URL）。
 * 历史文章（MoveableType / Jekyll，路径形如 `YYYY/MM/DD/x`）需保留扁平 `.html`
 * 以原样伺服历史链接，故在此钩子里把它们从 `<path>/index.html` 还原成 `<path>.html`
 * 并删除空目录。钩子在 `astro build` 内执行，早于 `pagefind --site dist`，因此搜索
 * 索引到的是还原后的最终布局。
 */
function legacyHtmlFlattener(): AstroIntegration {
  const LEGACY_PAGE_RE = /^\/?(\d{4}\/\d{2}\/\d{2}\/[^/]+)\/?$/;
  return {
    name: "legacy-html-flattener",
    hooks: {
      "astro:build:done": async ({ dir, pages, logger }) => {
        let flattened = 0;
        for (const { pathname } of pages) {
          const match = pathname.match(LEGACY_PAGE_RE);
          if (!match) continue;
          const rel = match[1];
          const fromFile = fileURLToPath(new URL(`${rel}/index.html`, dir));
          const toFile = fileURLToPath(new URL(`${rel}.html`, dir));
          const fromDir = fileURLToPath(new URL(`${rel}/`, dir));
          await fs.promises.rename(fromFile, toFile);
          await fs.promises.rmdir(fromDir);
          flattened += 1;
        }
        logger.info(`已将 ${flattened} 篇历史文章还原为扁平 .html`);
      },
    },
  };
}

function rawFonts(ext: string[]) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_: string, id: string) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        };
      }
    },
  };
}
