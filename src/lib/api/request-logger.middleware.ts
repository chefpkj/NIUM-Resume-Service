import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import createLogger from "../util/logger";

const logger = createLogger("api.bootstrap");

export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //TODO: need to do this requestId=serverIP+randomUUID+timestamp
  const requestId = randomUUID();
  const startTime = Date.now();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  logger.info("BEGIN request", {
    requestId,
    method: req.method,
    url: req.url,
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info("END request", {
      requestId,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}
