import { createLogger, format, transports, Logger } from "winston";
import * as morgan from 'morgan';
import { StreamOptions } from 'morgan';
import { TransformableInfo } from 'logform';
import * as fs from 'fs';
import * as path from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';


// Helper: Create nested log directories based on current date (year/month/day)
function getLogDir(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const logDir = path.join(__dirname, '../../../logs', year, month, day);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
}

const logDir = getLogDir();


// Define log format
const logFormat = format.printf(
    ({ timestamp, level, message, ...meta }: TransformableInfo) =>
        `${timestamp} :: [${level.toUpperCase()}] :: ${message}${Object.keys(meta).length ? ` :: ${JSON.stringify(meta)}` : ''}`
);

// Create the Winston logger
const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }),
        // ✅ Daily rotating error log
        new DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '60d', // Delete logs older than 14 days
        }),

        // ✅ Daily rotating combined log
        new DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '60d',
        }),
    ],
});

// Morgan stream config using Winston
const stream: StreamOptions = {
    write: (message: string) => logger.info(message.trim()),
};

// HTTP request logger middleware
const httpLogger = morgan(
    ':method :url :status :response-time ms - :res[content-length]',
    { stream }
);

export { logger, httpLogger };