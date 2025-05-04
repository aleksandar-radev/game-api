import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// https://github.com/winstonjs/winston

const filterOnly = (level: string) => {
  return winston.format((info) => {
    if (info.level === level) {
      return info;
    }
    return false; // Skip logging if level does not match
  })();
};

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

// Configure the log directory and log file name
const logDirectory = 'logs';
const errorFileName = 'error-%DATE%.log';

// Error log setup with daily rotation
const errorTransport = new DailyRotateFile({
  level: 'error',
  dirname: logDirectory,
  filename: errorFileName,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

const infoTransport = new winston.transports.File({
  level: 'info',
  filename: `${logDirectory}/info.log`,
  format: winston.format.combine(
    filterOnly('info'), // Apply the filter for only 'info' level logs
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info) => {
      return JSON.stringify({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        stack: info.stack,
      });
    }),
  ),
  maxsize: 5242880, // 5MB
  maxFiles: 5,
});

// const errorTransport = new winston.transports.File({
//   level: "error",
//   filename: `logs/error-${new Date().toISOString().slice(0, 10)}.log`,
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   maxsize: 5242880, // 5MB
//   maxFiles: 14,
//   tailable: true,
// });

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info) => {
      return JSON.stringify({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        stack: info.stack,
      });
    }),
  ),
  transports: [errorTransport, infoTransport],
});

export default logger;
