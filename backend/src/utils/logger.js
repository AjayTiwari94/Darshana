const winston = require('winston')
const path = require('path')

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(logColors)

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  defaultMeta: { service: 'darshana-backend' },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with importance level of 'info' or less to combined.log
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'exceptions.log') 
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'rejections.log') 
    })
  ]
})

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
      })
    )
  }))
}

// Create logs directory if it doesn't exist
const fs = require('fs')
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

module.exports = logger