export interface AppConfig {
  env: string;
  port: number;
  mongoUri: string;
}

const config: AppConfig = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGO_URI || "",
};

export default config;
