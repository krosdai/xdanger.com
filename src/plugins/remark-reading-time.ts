import type { Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import type { Plugin } from "unified";

// Define a remark plugin that adds reading time to frontmatter
export const remarkReadingTime: Plugin<[], Root> =
  () =>
  (tree, { data }) => {
    const textOnPage = mdastToString(tree);
    const readingTime = getReadingTime(textOnPage);

    // Make sure data.astro and data.astro.frontmatter exist
    data.astro ??= {};
    data.astro.frontmatter ??= {};

    // Add reading time to frontmatter
    data.astro.frontmatter.readingTime = readingTime.text;
  };
