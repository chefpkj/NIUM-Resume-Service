import {
  CreateResumeEntityProps,
  ResumeEntity,
  ResumeProps,
} from "./resume.types";

export function createResumeEntity(
  args: CreateResumeEntityProps
): ResumeEntity {
  const { id, props, createdAt, updatedAt } = args;
  const now = new Date();

  const entityData = {
    id,
    props: {
      ...props,
      created_at: props.created_at ?? now.getTime(),
      updated_at: props.updated_at ?? now.getTime(),
    } as ResumeProps,
    createdAt:
      createdAt ?? (props.created_at ? new Date(props.created_at) : now),
    updatedAt:
      updatedAt ?? (props.updated_at ? new Date(props.updated_at) : now),
  };

  return {
    getId: () => entityData.id,
    getFirstName: () => entityData.props.first_name,
    getLastName: () => entityData.props.last_name,
    getFullName: () =>
      `${entityData.props.first_name} ${entityData.props.last_name}`,
    getCurrentJobTitle: () => entityData.props.current_job_title,
    getCurrentJobDescription: () => entityData.props.current_job_description,
    getCurrentJobCompany: () => entityData.props.current_job_company,
    getCreatedAt: () => entityData.createdAt,
    getUpdatedAt: () => entityData.updatedAt,
    getProps: () => ({
      id: entityData.id,
      ...entityData.props,
      createdAt: entityData.createdAt,
      updatedAt: entityData.updatedAt,
    }),
    validate: () => {
      // TODO: Implement validation
    },
  };
}

export default createResumeEntity;
