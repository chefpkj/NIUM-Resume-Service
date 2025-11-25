export interface ResumeProps {
  first_name: string;
  last_name: string;
  current_job_title: string;
  current_job_description: string;
  current_job_company: string;
  created_at: number;
  updated_at: number;
}

export interface CreateResumeEntityProps {
  id: string;
  props: Omit<ResumeProps, "created_at" | "updated_at"> & {
    created_at?: number;
    updated_at?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeEntity {
  getId(): string;
  getFirstName(): string;
  getLastName(): string;
  getFullName(): string;
  getCurrentJobTitle(): string;
  getCurrentJobDescription(): string;
  getCurrentJobCompany(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  getProps(): ResumeProps & { id: string; createdAt: Date; updatedAt: Date };
  validate(): void;
}

export interface ResumeDbRecord {
  _id: string;
  first_name: string;
  last_name: string;
  current_job_title: string;
  current_job_description: string;
  current_job_company: string;
  createdAt?: Date;
  updatedAt?: Date;
}
