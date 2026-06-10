/// <reference types="astro/client" />

// Pagefind UI types
declare module "@pagefind/default-ui" {
  class PagefindUI {
    constructor(arg: unknown);
  }
}

// Fix for Astro content collections image type
declare module "astro:content" {
  type ImageFunction = () => ImageMetadata;

  interface DefineCollectionConfig<S extends import("astro/zod").ZodType> {
    schema?: (context: { image: ImageFunction }) => S;
  }
}
