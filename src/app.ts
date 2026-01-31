import express, { Router } from 'express'
import authRoutes from './routes/auth.routes'
import eventRoutes from './routes/event.routes'
// import { registerSwagger } from './utils/swagger'
import { errorMiddleware, notFoundHandler } from './middlewares/errorHandler.middleware'
import { UPLOAD_DIR } from './constants/constants'

const app = express()
const apiRouter = Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(UPLOAD_DIR))

app.use('/api', apiRouter)

// registerSwagger(apiRouter)

apiRouter.use('/auth', authRoutes)
apiRouter.use('/events', eventRoutes)

// API-only error handlers
apiRouter.use(notFoundHandler)
apiRouter.use(errorMiddleware)

export default app
