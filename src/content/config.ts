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

const talkCollection = defineCollection({
  type: "data",
  schema: z.object({
    talks: z.array(z.object({
      year: z.number(),
      conferences: z.array(z.object({
        title: z.string(),
        conference: z.string(),
        video: z.string().optional(),
      })),
    })),
  }),
});

export const collections = {
  writing: writingCollection,
  talks: talkCollection,
};
