import AppDataSource from '~/config/db'
import { Event } from '../models/event.entity'

export const eventRepo = AppDataSource.getRepository(Event)

export const findEventById = (id: string, relations: string[] = []) => {
  return eventRepo.findOne({ where: { id }, relations })
}
