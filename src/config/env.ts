import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not set`);

  return value;
}

export const env = {
  app: {
    port: Number(getEnv("PORT")),
  },
  db: {
    host: getEnv("DATABASE_HOST"),
    port: Number(getEnv("DATABASE_PORT")),
    username: getEnv("DATABASE_USERNAME"),
    password: getEnv("DATABASE_PASSWORD"),
    database: getEnv("DATABASE_NAME"),
  },
  jwt: {
    secret: getEnv("JWT_SECRET"),
    expiresIn: getEnv("JWT_EXPIRES_IN"),
  },
};
