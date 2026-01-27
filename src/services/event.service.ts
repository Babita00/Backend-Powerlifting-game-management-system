import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { userRole } from '../constants/userRole'
import { AppError } from '~/utils/appError'
import { eventRepo } from '../repositories/event.repo'
import { Event } from '../models/event.entity'
import { EventPrize } from '../models/eventPrize.entity'
import { EventStatus } from '~/constants/eventStatus'
import type { CreateEventDTO, UpdateEventDTO } from '~/validator/event.validator'
import { isAdmin, isOfficial } from '~/utils/authorization'

export const createEvent = async (params: {
  eventDto: CreateEventDTO
  user: { id: string; role: userRole }
}) => {
  const { eventDto, user } = params

  if (![userRole.ADMIN, userRole.OFFICIAL].includes(user.role)) {
    throw new AppError(STATUS.FORBIDDEN, 'You do not have permission to create events')
  }

  const prizeEntities = (eventDto.prizes ?? []).map(p => {
    const prize = new EventPrize()
    prize.title = p.title
    prize.amount = Number(p.amount).toFixed(2)
    return prize
  })

  const event = eventRepo.create({
    title: eventDto.title,
    description: eventDto.description,
    venue: eventDto.venue,
    startDate: new Date(eventDto.startDate),
    endDate: eventDto.endDate ? new Date(eventDto.endDate) : null,
    weightCategories: eventDto.weightCategories,
    competitionType: eventDto.competitionType,
    status: eventDto.status ?? EventStatus.UPCOMING,
    organizerPhoneNumber: eventDto.organizerPhoneNumber,
    eventImage: eventDto.eventImage ?? null,
    otherOfficial: eventDto.otherOfficial,
    coordinator: eventDto.coordinator,
    createdById: user.id,
    prizes: prizeEntities,
  } satisfies Partial<Event>)

  return eventRepo.save(event)
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

  // Load with ownership info + prizes if you plan to replace them
  const event = await eventRepo.findOne({
    where: { id: eventId },
    relations: { prizes: true }, // needed if you update prizes
  })

  if (!event) throw new AppError(STATUS.NOT_FOUND, 'Event not found')

  const isCreator = event.createdById === user.id

  if (!isAdmin(user) && !(isOfficial(user) && isCreator)) {
    throw new AppError(STATUS.FORBIDDEN, 'Only creator or admin can update this event')
  }

  // Update scalar fields (DTO already validated)
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
