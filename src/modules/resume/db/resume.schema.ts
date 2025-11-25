import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    current_job_title: { type: String, required: true },
    current_job_description: { type: String, required: true },
    current_job_company: { type: String, required: true },
  },
  { timestamps: true }
);

export default resumeSchema;
