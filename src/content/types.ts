interface TalkList {
    talks: YearList[]
};

interface YearList {
    year: string
    conferences: Conference[]
};

interface Conference {
    title: string
    conference: string
    video?: string
}

export type {TalkList, YearList, Conference};