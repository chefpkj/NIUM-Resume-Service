import mongoose, { Model } from "mongoose";
import { ResumeRepositoryPort } from "./resume.repository.port";
import { ResumeDbRecord } from "../domain/resume.types";
import { createResumeEntity } from "../domain/resume.entity";
import { createResumeMapper, ResumeMapper } from "../resume.mapper";
import resumeSchema from "./resume.schema";
import createLogger from "../../../lib/util/logger";

const logger = createLogger("resume.repository");

interface ResumeRepositoryState {
  model: Model<ResumeDbRecord> | null;
  mapper: ResumeMapper | null;
}

const state: ResumeRepositoryState = {
  model: null,
  mapper: null,
};

export async function initResumeRepository(mongoUri: string): Promise<void> {
  if (state.model) {
    logger.info("repository already initialized");
    return;
  }

  //TODO: we need to check this in app.config file ( saare envs set hue k nahi)
  if (!mongoUri) throw new Error("MONGO_URI not configured");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
    logger.info("db connected");
  }

  state.model = mongoose.model<ResumeDbRecord>("Resume", resumeSchema);
  state.mapper = createResumeMapper();
  logger.info("repository initialized");
}

function ensureInitialized(): {
  model: Model<ResumeDbRecord>;
  mapper: ResumeMapper;
} {
  if (!state.model || !state.mapper) {
    throw new Error(
      "resume repository not initialized, call initResumeRepository() first"
    );
  }
  return { model: state.model, mapper: state.mapper };
}

export function getResumeRepository(): ResumeRepositoryPort {
  const { model, mapper } = ensureInitialized();

  return {
    create: async (resumeProps) => {
      const entity = createResumeEntity({
        id: new mongoose.Types.ObjectId().toString(),
        props: {
          ...resumeProps,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      });

      const dbRecord = mapper.toPersistence(entity);
      const created = await model.create(dbRecord);

      return mapper.toDomain(created.toObject())!;
    },

    findById: async (id: string) => {
      const dbRecord = await model.findById(id);

      if (!dbRecord) {
        return null;
      }

      return mapper.toDomain(dbRecord.toObject());
    },

    findByFullName: async (firstName: string, lastName: string) => {
      const dbRecords = await model.find({
        first_name: new RegExp(`^${firstName}$`, "i"),
        last_name: new RegExp(`^${lastName}$`, "i"),
      });

      return dbRecords.map((record) => mapper.toDomain(record.toObject())!);
    },

    findByFirstName: async (firstName: string) => {
      const dbRecords = await model.find({
        first_name: new RegExp(`^${firstName}$`, "i"),
      });

      return dbRecords.map((record) => mapper.toDomain(record.toObject())!);
    },

    findByLastName: async (lastName: string) => {
      const dbRecords = await model.find({
        last_name: new RegExp(`^${lastName}$`, "i"),
      });

      return dbRecords.map((record) => mapper.toDomain(record.toObject())!);
    },
  };
}
