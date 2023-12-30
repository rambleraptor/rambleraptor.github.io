import { z } from "astro:content";

const ConferenceSchema  = z.object({
    name: z.string(),
    conference: z.string(),
    video: z.optional(z.string()),
});

const TalkYearSchema = z.object({
    year: z.number(),
    conferences: z.array(ConferenceSchema)
})

const TalkListSchema = z.object({
    years: z.array(TalkYearSchema)
})

type TalkList = z.infer<typeof TalkListSchema>;
type TalkYear = z.infer<typeof TalkYearSchema>;
type Conference = z.infer<typeof ConferenceSchema>;

export {TalkList, TalkYear, Conference}
