import { Request, Response } from "express";
import { ResumeService } from "./resume.service";
import createLogger from "../../lib/util/logger";

const logger = createLogger("resume.controller");

export interface ResumeController {
  uploadResumeDetails(req: Request, res: Response): Promise<void>;
  getResumeById(req: Request, res: Response): Promise<void>;
  getResumeByName(req: Request, res: Response): Promise<void>;
}

export function createResumeController(
  service: ResumeService
): ResumeController {
  return {
    uploadResumeDetails: async (req: Request, res: Response) => {
      const requestId = req.requestId;
      logger.info("POST /uploadResumeDetails", { requestId });

      const resumeId = await service.uploadResumeDetails(req.body, requestId);
      res.status(200).json({ status: "ok", data: { resumeId } });
    },

    getResumeById: async (req: Request, res: Response) => {
      const requestId = req.requestId;
      logger.info("GET /getResumeById", { requestId, id: req.params.id });

      const data = await service.getResumeDetailsById(req.params.id, requestId);
      res.json({ status: "ok", data });
    },

    getResumeByName: async (req: Request, res: Response) => {
      const requestId = req.requestId;
      logger.info("GET /getResumeByName", { requestId, name: req.params.name });

      const resumes = await service.searchResumesByName(
        req.params.name,
        requestId
      );
      res.json({ status: "ok", data: resumes });
    },
  };
}
