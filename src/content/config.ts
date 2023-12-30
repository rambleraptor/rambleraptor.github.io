import { z, defineCollection } from "astro:content";

const writingCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean(),
  }),
});

export const collections = {
  writing: writingCollection,
};
