import { z } from 'zod'
import { createEventSchema, updateEventSchema } from '~/validator/event.validator'

export type CreateEventDTO = z.infer<typeof createEventSchema>
export type UpdateEventDTO = z.infer<typeof updateEventSchema>
