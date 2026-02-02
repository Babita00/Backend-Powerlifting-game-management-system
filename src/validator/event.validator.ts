import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { zodErrorMessage } from '../utils/zodErrorMessage'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { EVENT_STATUS } from '~/constants/eventStatus'
import { COMPETITION_TYPES } from '~/constants/competitionType'

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

const competitionTypeSchema = z.enum(COMPETITION_TYPES)
const eventStatusSchema = z.enum(EVENT_STATUS)

const eventBaseSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  venue: z.string().trim().min(1).max(255),

  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),

  weightCategories: z.array(z.string().trim().min(1)).min(1),

  competitionType: competitionTypeSchema,
  status: eventStatusSchema.optional(),

  organizerPhoneNumber: z.string().trim().min(7).max(30).nullable().optional(),
  eventImage: z.string().trim().nullable().optional(),

  otherOfficial: contactSchema.nullable().optional(),
  coordinator: contactSchema.nullable().optional(),

  prizes: z.array(prizeSchema).optional(),
})

export const createEventSchema = eventBaseSchema.refine(
  data => !data.endDate || data.endDate >= data.startDate,
  { message: 'endDate must be >= startDate', path: ['endDate'] }
)

export const updateEventSchema = eventBaseSchema.partial().superRefine((data, ctx) => {
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: 'custom',
      message: 'endDate must be >= startDate',
      path: ['endDate'],
    })
  }
})

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
