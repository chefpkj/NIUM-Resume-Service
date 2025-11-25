import path from "path";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";

if (env === "development") {
  dotenv.config({ path: path.resolve(process.cwd(), "env/.dev.env") });
} else if (env === "production") {
  dotenv.config({ path: path.resolve(process.cwd(), "env/.prod.env") });
}
