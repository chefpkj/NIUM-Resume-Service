import "../../conf/env";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import config from "../../conf/app.conf";
import createLogger from "../../lib/util/logger";
import errorHandler from "../../lib/api/error-handler";
import {
  initResumeRepository,
  getWiredResumeRouter,
} from "../../modules/resume";

const logger = createLogger("api.bootstrap");

async function start() {
  await initResumeRepository(config.mongoUri);
  const app = express();

  app.use((req, res, next) => {
    const requestId = randomUUID();
    (req as any).requestId = requestId;
    res.setHeader("x-request-id", requestId);
    next();
  });

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", getWiredResumeRouter());
  app.use(errorHandler);

  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
}

start().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
