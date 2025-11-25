import { ResumeRepositoryPort } from "./db/resume.repository.port";
import {
  validateUploadPayload,
  decodeSearchName,
} from "./helpers/resume.helpers";
import { ResumeEntity } from "./domain/resume.types";
import createLogger from "../../lib/util/logger";

const logger = createLogger("resume.service");

export interface ResumeService {
  uploadResumeDetails(payload: unknown, requestId?: string): Promise<string>;
  getResumeDetailsById(
    id: string,
    requestId?: string
  ): Promise<{
    name: string;
    current_job_title: string;
    current_job_description: string;
    current_job_company: string;
  }>;
  searchResumesByName(
    rawNameParam: string,
    requestId?: string
  ): Promise<
    Array<{
      name: string;
      current_job_title: string;
      current_job_description: string;
      current_job_company: string;
    }>
  >;
}

export function createResumeService(
  repository: ResumeRepositoryPort
): ResumeService {
  return {
    uploadResumeDetails: async (payload: unknown, requestId?: string) => {
      logger.info("Uploading resume details", { requestId });

      const {
        parsedName,
        current_job_title,
        current_job_description,
        current_job_company,
      } = validateUploadPayload(payload);

      const resume = await repository.create({
        first_name: parsedName.first,
        last_name: parsedName.last,
        current_job_title,
        current_job_description,
        current_job_company,
      });

      logger.info("Resume created successfully", {
        requestId,
        resumeId: resume.getId(),
      });
      return resume.getId();
    },

    getResumeDetailsById: async (id: string, requestId?: string) => {
      logger.info("Fetching resume by ID", { requestId, id });

      const resume = await repository.findById(id);

      if (!resume) {
        logger.error("Resume not found", { requestId, id });
        const err = new Error("Resume not found") as any;
        err.status = 404;
        throw err;
      }

      return {
        name: resume.getFullName(),
        current_job_title: resume.getCurrentJobTitle(),
        current_job_description: resume.getCurrentJobDescription(),
        current_job_company: resume.getCurrentJobCompany(),
      };
    },

    searchResumesByName: async (rawNameParam: string, requestId?: string) => {
      logger.info("Searching resume by name", {
        requestId,
        searchParam: rawNameParam,
      });

      const { first, last } = decodeSearchName(rawNameParam);
      const exactMatches = await repository.findByFullName(first, last);

      if (exactMatches.length > 0) {
        logger.info("Found exact matches", {
          requestId,
          count: exactMatches.length,
        });
        return exactMatches.map((resume) => ({
          name: resume.getFullName(),
          current_job_title: resume.getCurrentJobTitle(),
          current_job_description: resume.getCurrentJobDescription(),
          current_job_company: resume.getCurrentJobCompany(),
        }));
      }

      const [firstMatches, lastMatches] = await Promise.all([
        repository.findByFirstName(first),
        repository.findByLastName(last),
      ]);

      const map = new Map<string, ResumeEntity>();
      [...firstMatches, ...lastMatches].forEach((resume) => {
        map.set(resume.getId(), resume);
      });

      const uniqueResults = Array.from(map.values());
      logger.info("Found partial matches", {
        requestId,
        count: uniqueResults.length,
      });

      return uniqueResults.map((resume) => ({
        name: resume.getFullName(),
        current_job_title: resume.getCurrentJobTitle(),
        current_job_description: resume.getCurrentJobDescription(),
        current_job_company: resume.getCurrentJobCompany(),
      }));
    },
  };
}
