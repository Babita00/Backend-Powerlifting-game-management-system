import { Response } from 'express'
import { errorResponse, successResponse } from '~/utils/response'
import * as EventService from '../services/event.service'
import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { CustomRequest } from '~/types/customRequest'
import { UpdateEventDTO, CreateEventDTO } from '~/types/event.types'

export const create = async (req: CustomRequest, res: Response) => {
  const user = req.user
  const eventDto = req.body as CreateEventDTO

  const result = await EventService.createEvent({
    eventDto,
    user: { id: user.id, role: user.role },
  })

  return successResponse(res, STATUS.CREATED, 'Event created successfully', result)
}

export const update = async (req: CustomRequest, res: Response) => {
  const user = req.user

  if (!user) return errorResponse(res, STATUS.UNAUTHORIZED, 'Unauthorized')

  const { eventId } = req.params
  const eventDto = req.body as UpdateEventDTO

  const result = await EventService.updateEvent({
    eventId: eventId as string,
    dto: eventDto,
    user: { id: user.id, role: user.role },
  })

  return successResponse(res, STATUS.CREATED, 'Event updated successfully', result)
}
