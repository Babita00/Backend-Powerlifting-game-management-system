import { z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { zodErrorMessage } from '../utils/zodErrorMessage'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { CompetitionType } from '../constants/competitionType'
import { EventStatus } from '../constants/eventStatus'

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

const eventBaseSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).nullable().optional(),
  venue: z.string().trim().min(1).max(255),

  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),

  weightCategories: z.array(z.string().trim().min(1)).min(1),

  competitionType: z.nativeEnum(CompetitionType),
  status: z.nativeEnum(EventStatus).optional(),

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

// update: partial first (allowed), then add refine if you want
export const updateEventSchema = eventBaseSchema.partial().superRefine((data, ctx) => {
  // For updates, only validate the date relation if BOTH are present
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
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
