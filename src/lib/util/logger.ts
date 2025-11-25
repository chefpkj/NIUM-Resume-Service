import {
  createLogger as createWinstonLogger,
  format,
  transports,
} from "winston";
import path from "path";
import config from "../../conf/app.conf";

const logDir = path.resolve(process.cwd(), "logs");
const isDev = config.env === "development";

const winstonLogger = createWinstonLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: isDev
        ? format.combine(
            format.colorize(),
            format.printf(({ level, message, service, ...meta }) => {
              const serviceTag = service ? `[${service}]` : "";
              const metaStr = Object.keys(meta).length
                ? JSON.stringify(meta)
                : "";
              return `${level} ${serviceTag} ${message} ${metaStr}`;
            })
          )
        : format.json(),
    }),
    new transports.File({
      filename: path.resolve(logDir, "app.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

interface Logger {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any> | Error): void;
}

export default function createLogger(serviceName: string): Logger {
  return {
    info: (message, meta = {}) => {
      winstonLogger.info(message, { service: serviceName, ...meta });
    },
    error: (message, meta: any = {}) => {
      if (meta instanceof Error) {
        winstonLogger.error(message, {
          service: serviceName,
          error: meta.message,
          stack: meta.stack,
        });
      } else {
        winstonLogger.error(message, { service: serviceName, ...meta });
      }
    },
  };
}
