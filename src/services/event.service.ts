import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { userRole } from '../constants/userRole'
import { AppError } from '~/utils/appError'
import { eventRepo } from '../repositories/event.repo'
import { Event } from '../models/event.entity'
import { EventPrize } from '../models/eventPrize.entity'
import { EventStatus } from '~/constants/eventStatus'
import type { CreateEventDTO, UpdateEventDTO } from '~/types/event.types'
import { isAdmin, isOfficial } from '~/utils/authorization'

export const createEvent = async (params: {
  eventDto: CreateEventDTO
  user: { id: string; role: userRole }
}) => {
  const { eventDto, user } = params

  if (![userRole.ADMIN, userRole.OFFICIAL].includes(user.role)) {
    throw new AppError(STATUS.FORBIDDEN, 'You do not have permission to create events')
  }

  const {
    title,
    description,
    venue,
    startDate,
    endDate,
    weightCategories,
    competitionType,
    status,
    organizerPhoneNumber,
    eventImage,
    otherOfficial,
    coordinator,
    prizes = [],
  } = eventDto

  const prizeEntities = prizes.map(p => {
    const prize = new EventPrize()
    prize.title = p.title
    prize.amount = Number(p.amount).toFixed(2)
    return prize
  })

  const payload: Partial<Event> = {
    title,
    description: description ?? '',
    venue,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    weightCategories,
    competitionType,
    status: status ?? EventStatus.UPCOMING,
    organizerPhoneNumber: organizerPhoneNumber ?? '',
    eventImage: eventImage ?? null,
    otherOfficial: otherOfficial ?? null,
    coordinator: coordinator ?? null,
    createdById: user.id,
    prizes: prizeEntities,
  }

  return eventRepo.save(eventRepo.create(payload))
}

export const updateEvent = async (params: {
  eventId: string
  dto: UpdateEventDTO
  user: { id: string; role: userRole }
}) => {
  const { eventId, dto, user } = params

  if (![userRole.ADMIN, userRole.OFFICIAL].includes(user.role)) {
    throw new AppError(STATUS.FORBIDDEN, 'You do not have permission to update events')
  }

  const event = await eventRepo.findOne({
    where: { id: eventId },
    relations: { prizes: true },
  })

  if (!event) throw new AppError(STATUS.NOT_FOUND, 'Event not found')

  const isCreator = event.createdById === user.id

  if (!isAdmin(user) && !(isOfficial(user) && isCreator)) {
    throw new AppError(STATUS.FORBIDDEN, 'Only creator or admin can update this event')
  }

  Object.assign(event, {
    title: dto.title ?? event.title,
    description: dto.description ?? event.description,
    venue: dto.venue ?? event.venue,
    startDate: dto.startDate ? new Date(dto.startDate) : event.startDate,
    endDate:
      dto.endDate !== undefined
        ? dto.endDate
          ? new Date(dto.endDate)
          : null
        : event.endDate,
    weightCategories: dto.weightCategories ?? event.weightCategories,
    competitionType: dto.competitionType ?? event.competitionType,
    status: dto.status ?? event.status,
    organizerPhoneNumber: dto.organizerPhoneNumber ?? event.organizerPhoneNumber,
    eventImage: dto.eventImage !== undefined ? dto.eventImage : event.eventImage,
    otherOfficial: dto.otherOfficial ?? event.otherOfficial,
    coordinator: dto.coordinator ?? event.coordinator,
  })

  if (dto.prizes !== undefined) {
    event.prizes = (dto.prizes ?? []).map(p => {
      const prize = new EventPrize()
      prize.title = p.title
      prize.amount = Number(p.amount).toFixed(2)
      return prize
    })
  }

  return eventRepo.save(event)
}
