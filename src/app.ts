import express, { Router } from 'express'

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

// API-only error handlers
apiRouter.use(notFoundHandler)
apiRouter.use(errorMiddleware)

export default app
