import { Request, Response, NextFunction } from "express";
import { fail } from "./api-response";
import createLogger from "../util/logger";

const logger = createLogger("error-handler");

interface CustomError extends Error {
  status?: number;
}

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error("Request error", { error: err.message, status: err.status });
  if (res.headersSent) return;
  const status = err.status || 500;
  res.status(status).json(fail(err.message || "Internal server error"));
}
