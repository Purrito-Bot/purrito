import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'purrito' },
  transports: [
    new winston.transports.File({ filename: 'purrito.log', level: 'info' }),
    new winston.transports.Console({ format: winston.format.simple(), level: 'info' })
  ]
});
