import "../../conf/env";
import express from "express";
import cors from "cors";
import config from "../../conf/app.conf";
import createLogger from "../../lib/util/logger";
import errorHandler from "../../lib/api/error-handler";
import { requestLoggingMiddleware } from "../../lib/api/request-logger.middleware";
import { serveFrontend } from "../../lib/api/serve-frontend";
import {
  initializeObservability,
  observabilityMiddleware,
} from "../../lib/observability";
import {
  initResumeRepository,
  getWiredResumeRouter,
} from "../../modules/resume";

const logger = createLogger("api.bootstrap");

async function start() {
  initializeObservability();
  await initResumeRepository(config.mongoUri);
  const app = express();

  app.use(requestLoggingMiddleware);
  app.use(observabilityMiddleware());
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", getWiredResumeRouter());
  app.use(serveFrontend());
  app.use(errorHandler);

  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});

//TODO
// 1. logger files management in prod
// 2.
