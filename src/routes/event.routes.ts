import { Router } from 'express'
import { requireAuth } from '../middlewares/requireAuth.ts'
import { userRole } from '~/constants/userRole'
import { requireRole } from '~/middlewares/requireRole.ts'
import { createEventValidator } from '~/validator/event.validator.ts'
import * as EventController from '../controller/event.controller'

const router = Router()

router.post(
  '/',
  requireAuth,
  requireRole([userRole.ADMIN, userRole.OFFICIAL]),
  createEventValidator,
  EventController.create
)
