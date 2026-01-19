import { Request } from 'express'
import { User } from '../model/user.entity'

export interface CustomRequest extends Request {
  user?: User | null | Error
  file?: Express.Multer.File
}
