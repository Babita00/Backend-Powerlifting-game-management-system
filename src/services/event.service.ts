import { HttpStatusCodes as STATUS } from '../constants/httpStatusCodes'
import { userRole } from '../constants/userRole'
import { AppError } from '~/utils/appError'
import { eventRepo } from '../repositories/event.repo'
import { Event } from '../models/event.entity'
import { EventPrize } from '../models/eventPrize.entity'
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
    status: status ?? 'upcoming',
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
  eventDto: UpdateEventDTO
  user: { id: string; role: userRole }
}) => {
  const { eventId, eventDto, user } = params

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

  const nextStart = eventDto.startDate ? new Date(eventDto.startDate) : event.startDate
  const nextEnd =
    eventDto.endDate !== undefined
      ? eventDto.endDate
        ? new Date(eventDto.endDate)
        : null
      : event.endDate

  // ✅ enforce invariant even when only endDate is provided
  if (nextEnd && nextEnd < nextStart) {
    throw new AppError(STATUS.BAD_REQUEST, 'endDate must be >= startDate')
  }

  Object.assign(event, {
    title: eventDto.title ?? event.title,
    description: eventDto.description ?? event.description,
    venue: eventDto.venue ?? event.venue,
    startDate: nextStart,
    endDate: nextEnd,
    weightCategories: eventDto.weightCategories ?? event.weightCategories,
    competitionType: eventDto.competitionType ?? event.competitionType,
    status: eventDto.status ?? event.status,
    organizerPhoneNumber: eventDto.organizerPhoneNumber ?? event.organizerPhoneNumber,
    eventImage:
      eventDto.eventImage !== undefined ? eventDto.eventImage : event.eventImage,
    otherOfficial: eventDto.otherOfficial ?? event.otherOfficial,
    coordinator: eventDto.coordinator ?? event.coordinator,
  })

  if (eventDto.prizes !== undefined) {
    event.prizes = (eventDto.prizes ?? []).map(p => {
      const prize = new EventPrize()
      prize.title = p.title
      prize.amount = Number(p.amount).toFixed(2)
      return prize
    })
  }

  return eventRepo.save(event)
}
