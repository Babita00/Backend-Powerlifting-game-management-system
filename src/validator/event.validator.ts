import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { zodErrorMessage } from '~/utils/zodErrorMessage'
import { HttpStatusCodes as STATUS } from '~/constants/httpStatusCodes'
import { CompetitionType } from '~/constants/competitionType'

export const uuidSchema = z.object({
  id: z.uuid(),
})

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone_number: z.string().trim().min(7, 'Phone is required'),
  email: z.string().email().optional(),
})

const prizeSchema = z.object({
  title: z.string().trim().min(1, 'Prize title is required'),
  amount: z.coerce.number().min(0, 'Prize amount must be >= 0'),
})

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().min(1, 'Description is required'),
    venue: z.string().trim().min(1, 'Venue is required'),

    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),

    weightCategories: z.array(z.string().trim().min(1)).min(1),

    competitionType: z.nativeEnum(CompetitionType),

    organizerPhoneNumber: z.string().trim().min(7),
    eventImage: z.string().trim().nullable().optional(),

    otherOfficial: contactSchema,
    coordinator: contactSchema,

    prizes: z.array(prizeSchema).default([]),
  })
  .refine(data => !data.endDate || data.endDate >= data.startDate, {
    message: 'endDate must be >= startDate',
    path: ['endDate'],
  })

export type CreateEventDTO = z.infer<typeof createEventSchema>

// Update: allow partial updates (and keep the same refine)
export const updateEventSchema = createEventSchema
  .partial()
  .refine(data => !data.endDate || !data.startDate || data.endDate >= data.startDate, {
    message: 'endDate must be >= startDate',
    path: ['endDate'],
  })

export type UpdateEventDTO = z.infer<typeof updateEventSchema>

export const createEventValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = await createEventSchema.safeParseAsync(req.body)
  if (!parsed.success) {
    const returnMessage = zodErrorMessage(parsed)
    return res.status(STATUS.BAD_REQUEST).json({ data: returnMessage })
  }
  next()
}

export const updateEventValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params

  const idParsed = uuidSchema.safeParse({ id: eventId })
  if (!idParsed.success) {
    const returnMessage = zodErrorMessage(idParsed)
    return res.status(STATUS.BAD_REQUEST).json({ data: returnMessage })
  }

  const bodyParsed = await updateEventSchema.safeParseAsync(req.body)
  if (!bodyParsed.success) {
    const returnMessage = zodErrorMessage(bodyParsed)
    return res.status(STATUS.BAD_REQUEST).json({ data: returnMessage })
  }

  next()
}

export const validateEventId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { eventId } = req.params

  const idParsed = uuidSchema.safeParse({ id: eventId })
  if (!idParsed.success) {
    const returnMessage = zodErrorMessage(idParsed)
    return res.status(STATUS.BAD_REQUEST).json({ data: returnMessage })
  }

  next()
}
