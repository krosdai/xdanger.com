import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import MonoBold from "@/assets/ia-writer-mono-bold.ttf";
import MonoRegular from "@/assets/ia-writer-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import type { SatoriOptions } from "satori";

import satori from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
  // debug: true,
  fonts: [
    {
      data: Buffer.from(MonoRegular),
      name: "iA Writer Mono S",
      style: "normal",
      weight: 400,
    },
    {
      data: Buffer.from(MonoBold),
      name: "iA Writer Mono S",
      style: "normal",
      weight: 700,
    },
  ],
  height: 630,
  width: 1200,
};

const cacheDirectory = path.join(process.cwd(), ".astro", "og-image-cache");
const fontSignature = createHash("sha256")
  .update(new Uint8Array(Buffer.from(MonoRegular)))
  .update(new Uint8Array(Buffer.from(MonoBold)))
  .digest("hex");
const refreshOgImages = process.env.REFRESH_OG_IMAGES === "1";

const markup = (title: string, pubDate: string) =>
  html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
    <div tw="flex flex-col flex-1 w-full p-10 justify-center">
      <p tw="text-2xl mb-6">${pubDate}</p>
      <h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
    </div>
    <div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
      <div tw="flex items-center">
        <svg height="60" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 480">
          <path
            d="M181.334 93.333v-40L226.667 80v40l-45.333-26.667ZM136.001 53.333 90.667 26.667v426.666L136.001 480V53.333Z"
            fill="#B04304"
          ></path>
          <path
            d="m136.001 119.944 45.333-26.667 45.333 26.667-45.333 26.667-45.333-26.667ZM90.667 26.667 136.001 0l45.333 26.667-45.333 26.666-45.334-26.666ZM181.334 53.277l45.333-26.666L272 53.277l-45.333 26.667-45.333-26.667ZM0 213.277l45.333-26.667 45.334 26.667-45.334 26.667L0 213.277ZM136 239.944l-45.333-26.667v53.333L136 239.944Z"
            fill="#FF5D01"
          ></path>
          <path
            d="m136 53.333 45.333-26.666v120L226.667 120V80L272 53.333V160l-90.667 53.333v240L136 480V306.667L45.334 360V240l45.333-26.667v53.334L136 240V53.333Z"
            fill="#53C68C"
          ></path>
          <path d="M45.334 240 0 213.334v120L45.334 360V240Z" fill="#B04304"></path>
        </svg>
        <p tw="ml-3 font-semibold">${siteConfig.title}</p>
      </div>
      <p>by ${siteConfig.author}</p>
    </div>
  </div>`;

const rendererSignature = createHash("sha256")
  .update(JSON.stringify(markup("__TITLE__", "__DATE__")))
  .update(
    JSON.stringify({
      height: ogOptions.height,
      renderer: "satori-resvg",
      version: "v1",
      width: ogOptions.width,
    }),
  )
  .digest("hex");

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
  const { pubDate, title } = context.props as Props;

  const postDate = getFormattedDate(pubDate, {
    month: "long",
    weekday: "long",
  });
  const cacheFile = getCacheFile(context.params.slug ?? "", title, postDate);
  const cachedPng = refreshOgImages ? undefined : await readCachedPng(cacheFile);

  if (cachedPng) {
    return imageResponse(cachedPng);
  }

  const svg = await satori(markup(title, postDate), ogOptions);
  const png = new Uint8Array(new Resvg(svg).render().asPng());
  await writeCachedPng(cacheFile, png);

  return imageResponse(png);
}

function getCacheFile(slug: string, title: string, postDate: string) {
  const cacheKey = createHash("sha256")
    .update(
      JSON.stringify({
        author: siteConfig.author,
        fontSignature,
        postDate,
        rendererSignature,
        siteTitle: siteConfig.title,
        slug,
        title,
      }),
    )
    .digest("hex");

  return path.join(cacheDirectory, `${cacheKey}.png`);
}

async function readCachedPng(cacheFile: string) {
  try {
    const png = new Uint8Array(await readFile(cacheFile));
    return isCompletePng(png) ? png : undefined;
  } catch {
    return undefined;
  }
}

async function writeCachedPng(cacheFile: string, png: Uint8Array) {
  try {
    await mkdir(cacheDirectory, { recursive: true });
    await writeFile(cacheFile, png);
  } catch (error) {
    // Cache writes are best effort; builds should still succeed without them.
    console.warn("og-image: failed to write cache file", cacheFile, error);
  }
}

function imageResponse(png: Uint8Array) {
  return new Response(png as BodyInit, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
}

function isCompletePng(png: Uint8Array) {
  if (
    png.length < 12 ||
    png[0] !== 0x89 ||
    png[1] !== 0x50 ||
    png[2] !== 0x4e ||
    png[3] !== 0x47 ||
    png[4] !== 0x0d ||
    png[5] !== 0x0a ||
    png[6] !== 0x1a ||
    png[7] !== 0x0a
  ) {
    return false;
  }

  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let offset = 8;

  while (offset + 12 <= png.length) {
    const chunkLength = view.getUint32(offset);
    const chunkTypeOffset = offset + 4;
    const chunkEnd = offset + 12 + chunkLength;

    if (chunkEnd > png.length) {
      return false;
    }

    const isIend =
      png[chunkTypeOffset] === 0x49 &&
      png[chunkTypeOffset + 1] === 0x45 &&
      png[chunkTypeOffset + 2] === 0x4e &&
      png[chunkTypeOffset + 3] === 0x44;

    if (isIend) {
      return chunkEnd === png.length;
    }

    offset = chunkEnd;
  }

  return false;
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts
    .filter(({ data }) => !data.ogImage)
    .map((post) => ({
      params: { slug: post.id },
      props: {
        pubDate: post.data.updatedDate ?? post.data.publishDate,
        title: post.data.title,
      },
    }));
}
