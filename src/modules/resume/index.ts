export { createResumeEntity } from "./domain/resume.entity";
export type {
  ResumeEntity,
  ResumeProps,
  ResumeDbRecord,
} from "./domain/resume.types";
export type { ResumeDto } from "./dtos/resume.dto";
export {
  initResumeRepository,
  getResumeRepository,
} from "./db/resume.repository";
export type { ResumeRepositoryPort } from "./db/resume.repository.port";
export { createResumeMapper } from "./resume.mapper";
export { createResumeService, type ResumeService } from "./resume.service";
export {
  createResumeController,
  type ResumeController,
} from "./resume.controller";
export { createResumeRouter } from "./resume.router";

import type { ResumeRepositoryPort } from "./db/resume.repository.port";
import { getResumeRepository } from "./db/resume.repository";
import { createResumeService } from "./resume.service";
import { createResumeController } from "./resume.controller";
import { createResumeRouter } from "./resume.router";

let resumeRouter: any = null;

export function getWiredResumeRouter() {
  if (!resumeRouter) {
    const repository: ResumeRepositoryPort = getResumeRepository();
    const service = createResumeService(repository);
    const controller = createResumeController(service);
    resumeRouter = createResumeRouter(controller);
  }
  return resumeRouter;
}
