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
  format: format.combine(format.errors({ stack: true }), format.json()),
  transports: [
    new transports.Console({
      format: isDev
        ? format.combine(
            format.colorize(),
            format.printf(({ level, message, name, requestId, metadata }) => {
              const nameTag = name ? `[${name}]` : "";
              const reqId = requestId ? `requestId=${requestId}` : "";
              const metaStr = metadata
                ? `metadata=${JSON.stringify(metadata)}`
                : "";
              return `${level} ${nameTag} ${message} ${reqId} ${metaStr}`.trim();
            })
          )
        : format.json(),
    }),
    new transports.File({
      filename: path.resolve(logDir, "app.log"),
      maxsize: 5242880,
      maxFiles: 5,
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

interface Logger {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any> | Error): void;
}

export default function createLogger(name: string): Logger {
  return {
    info: (message, data = {}) => {
      const { requestId, ...metadata } = data;
      winstonLogger.info(message, {
        name,
        ...(requestId && { requestId }),
        ...(Object.keys(metadata).length > 0 && { metadata }),
      });
    },
    error: (message, data: any = {}) => {
      if (data instanceof Error) {
        winstonLogger.error(message, {
          name,
          metadata: { error: data.message, stack: data.stack },
        });
      } else {
        const { requestId, ...metadata } = data;
        winstonLogger.error(message, {
          name,
          ...(requestId && { requestId }),
          ...(Object.keys(metadata).length > 0 && { metadata }),
        });
      }
    },
  };
}
