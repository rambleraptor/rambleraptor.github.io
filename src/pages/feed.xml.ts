import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const writing = await getCollection("writing");
  return rss({
    // `<title>` field in output xml
    title: "Alex Stephen",
    // `<description>` field in output xml
    description: "Alex Stephen's Blog",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/writing/${post.slug}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
