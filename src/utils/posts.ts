import { getCollection, getEntry } from "astro:content";

type InternalPost = Awaited<ReturnType<typeof getCollection<"writing">>>[0];
type ExternalPost = {
  title: string;
  url: string;
  site: string;
  date: Date;
  tags?: string[];
  description?: string;
};

export type Post = InternalPost | ExternalPost;

/**
 * Fetches all posts (internal and external) and returns them sorted by date
 */
export async function getAllPosts(): Promise<Post[]> {
  // Get internal posts
  const internalPosts = await getCollection("writing", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Get external posts
  const externalPostsEntry = await getEntry("external-posts", "external-posts");
  const externalPosts = externalPostsEntry?.data || [];

  // Combine and sort
  const allPosts = [...internalPosts, ...externalPosts];
  return sortPostsByDate(allPosts);
}

/**
 * Fetches all posts for a specific tag and returns them sorted by date
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  // Get internal posts
  const internalPosts = await getCollection("writing", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Get external posts
  const externalPostsEntry = await getEntry("external-posts", "external-posts");
  const externalPosts = externalPostsEntry?.data || [];

  // Filter internal posts by tag
  const filteredInternalPosts = internalPosts.filter((post) =>
    post.data.tags.includes(tag)
  );

  // Filter external posts by tag
  const filteredExternalPosts = externalPosts.filter(
    (post) => post.tags && post.tags.includes(tag)
  );

  // Combine and sort
  const allPosts = [...filteredInternalPosts, ...filteredExternalPosts];
  return sortPostsByDate(allPosts);
}

/**
 * Gets all unique tags from both internal and external posts
 */
export async function getAllTags(): Promise<string[]> {
  // Get internal posts
  const internalPosts = await getCollection("writing", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Get external posts
  const externalPostsEntry = await getEntry("external-posts", "external-posts");
  const externalPosts = externalPostsEntry?.data || [];

  // Collect all tags from internal posts
  const internalTags = internalPosts.map((post) => post.data.tags).flat();

  // Collect all tags from external posts
  const externalTags = externalPosts
    .filter((post) => post.tags)
    .map((post) => post.tags!)
    .flat();

  return [...new Set([...internalTags, ...externalTags])];
}

/**
 * Sorts posts by date (newest first) regardless of whether they're internal or external
 */
function sortPostsByDate(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    const dateA = "data" in a ? a.data.date : a.date;
    const dateB = "data" in b ? b.data.date : b.date;
    return dateB.getTime() - dateA.getTime();
  });
}
