export const EVENT_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const
export type EventStatus = (typeof EVENT_STATUS)[number]
