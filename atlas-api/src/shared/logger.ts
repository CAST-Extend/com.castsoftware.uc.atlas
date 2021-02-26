import fs from 'fs';
import { createLogger } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const winston = require('winston');

interface IMessage { 
  timestamp: any; 
  level: string; 
  message : string; 
}
 
const { combine, timestamp, printf } = winston.format;
const logFormat = printf((message: IMessage) => `${message.timestamp} :: ${process.env.NODE_ENV} :: ${message.level}: ${message.message}`);

const logger = winston.createLogger({
  level: 'info',

  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),

  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
      new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/info', // log file /logs/info/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/error', // log file /logs/error/*.log in save
      filename: `%DATE%.error.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),

   
  ],
});
 
 
 const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};


if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export { logger, stream };
