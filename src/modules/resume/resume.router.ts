import express, { Router } from "express";
import { ResumeController } from "./resume.controller";

const asyncHandler =
  (fn: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export function createResumeRouter(controller: ResumeController): Router {
  const router = express.Router();

  router.post(
    "/uploadResumeDetails",
    asyncHandler(controller.uploadResumeDetails)
  );
  router.get("/getResumeById/:id", asyncHandler(controller.getResumeById));
  router.get(
    "/getResumeByName/:name",
    asyncHandler(controller.getResumeByName)
  );

  return router;
}
