import { createResumeEntity } from "./domain/resume.entity";
import { ResumeDbRecord, ResumeEntity } from "./domain/resume.types";

export interface ResumeMapper {
  toDomain(dbRecord: ResumeDbRecord): ResumeEntity | null;
  toPersistence(entity: ResumeEntity): ResumeDbRecord;
}

export function createResumeMapper(): ResumeMapper {
  return {
    toDomain: (dbRecord: ResumeDbRecord): ResumeEntity | null => {
      if (!dbRecord) {
        return null;
      }

      return createResumeEntity({
        id: dbRecord._id.toString(),
        props: {
          first_name: dbRecord.first_name,
          last_name: dbRecord.last_name,
          current_job_title: dbRecord.current_job_title,
          current_job_description: dbRecord.current_job_description,
          current_job_company: dbRecord.current_job_company,
          created_at: dbRecord.createdAt?.getTime() ?? Date.now(),
          updated_at: dbRecord.updatedAt?.getTime() ?? Date.now(),
        },
        createdAt: dbRecord.createdAt,
        updatedAt: dbRecord.updatedAt,
      });
    },

    toPersistence: (entity: ResumeEntity): ResumeDbRecord => {
      const props = entity.getProps();

      return {
        _id: entity.getId(),
        first_name: props.first_name,
        last_name: props.last_name,
        current_job_title: props.current_job_title,
        current_job_description: props.current_job_description,
        current_job_company: props.current_job_company,
      };
    },
  };
}

export default createResumeMapper;
