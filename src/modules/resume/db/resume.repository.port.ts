import { ResumeEntity } from "../domain/resume.types";

export interface ResumeRepositoryPort {
  create(resumeProps: {
    first_name: string;
    last_name: string;
    current_job_title: string;
    current_job_description: string;
    current_job_company: string;
  }): Promise<ResumeEntity>;

  findById(id: string): Promise<ResumeEntity | null>;

  findByFullName(firstName: string, lastName: string): Promise<ResumeEntity[]>;

  findByFirstName(firstName: string): Promise<ResumeEntity[]>;

  findByLastName(lastName: string): Promise<ResumeEntity[]>;
}
