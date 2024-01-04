import { z, defineCollection } from "astro:content";

const writingCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  writing: writingCollection,
};
