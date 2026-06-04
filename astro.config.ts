import fs from "node:fs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
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
//   mkdir -p .cert/anyip
//   curl -o .cert/anyip/fullchain.pem https://anyip.dev/cert/fullchain.pem
//   curl -o .cert/anyip/privkey.pem   https://anyip.dev/cert/privkey.pem
// Then open e.g. https://100-77-4-5.anyip.dev:4321 (your Tailscale IP, dashed).
const anyipCert = "./.cert/anyip/fullchain.pem";
const anyipKey = "./.cert/anyip/privkey.pem";
const devHttps =
  fs.existsSync(anyipCert) && fs.existsSync(anyipKey)
    ? { cert: fs.readFileSync(anyipCert), key: fs.readFileSync(anyipKey) }
    : undefined;

// https://astro.build/config
export default defineConfig({
  // adapter: vercel(),
  // Dev/preview server — listen on all interfaces so it's reachable over
  // Tailscale (MagicDNS host `*.hound-manta.ts.net`) for remote debugging.
  // The leading dot in `allowedHosts` whitelists every machine in the tailnet.
  server: {
    host: true,
    port: 4321,
    allowedHosts: [".hound-manta.ts.net", ".anyip.dev"],
  },
  build: {
    // https://docs.astro.build/zh-cn/reference/configuration-reference/#buildformat
    format: "preserve",
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
