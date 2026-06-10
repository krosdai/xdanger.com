import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft posts based on the environment and sort by publishDate in descending order */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
  const posts = await getCollection("post", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
  const grouped = new Map<string, CollectionEntry<"post">[]>();
  for (const post of posts) {
    const year = String(post.data.publishDate.getFullYear());
    const group = grouped.get(year);
    if (group) {
      group.push(post);
    } else {
      grouped.set(year, [post]);
    }
  }
  return Object.fromEntries(grouped);
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function getAllTags(posts: CollectionEntry<"post">[]) {
  return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
  return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
  return [
    ...getAllTags(posts).reduce(
      (acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
      new Map<string, number>(),
    ),
  ].sort((a, b) => b[1] - a[1]);
}
