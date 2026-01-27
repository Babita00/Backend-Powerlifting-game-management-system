import AppDataSource from '~/config/db'
import { Event } from '../models/event.entity'

export const eventRepo = AppDataSource.getRepository(Event)
