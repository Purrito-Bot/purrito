import * as winston from 'winston'

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
            (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
        )
    ),
    defaultMeta: { service: 'purrito' },
    transports: [
        new winston.transports.File({
            filename: 'purrito.log',
            level: 'debug',
            handleExceptions: true,
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
        }),
    ],
})
