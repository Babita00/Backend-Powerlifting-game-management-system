import 'reflect-metadata'
import dotenv from 'dotenv'
import app from './app'
import AppDataSource from './config/db'
import logger from './utils/logger'

dotenv.config()

const PORT = Number(process.env.PORT) || 3000
const DB = process.env.DB_DATABASE

const startServer = async () => {
  try {
    await AppDataSource.initialize()
    logger.info(`Database connected successfully! Connected to ${DB}`)

    app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}`)
      if (process.env.NODE_ENV === 'development') {
        logger.info(`Local Address: http://localhost:${PORT}/`)
        logger.info(`Swagger docs available at http://localhost:${PORT}/api/docs`)
      }
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
