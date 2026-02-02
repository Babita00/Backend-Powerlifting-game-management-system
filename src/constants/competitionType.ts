export const COMPETITION_TYPES = ['Male', 'Female', 'Open'] as const
export type CompetitionType = (typeof COMPETITION_TYPES)[number]
