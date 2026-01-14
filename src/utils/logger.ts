import path from 'path'
import fs from 'fs'
import appRoot from 'app-root-path'
import winston from 'winston'

const LOG_DIR = path.join(appRoot.path, 'logs')
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`
  })
)

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] [${level}] ${stack || message}`
  })
)

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: fileFormat,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 30,
    }),
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      level: 'info',
      handleExceptions: true,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 30,
    }),
  ],
  exitOnError: false,
})

export default logger
