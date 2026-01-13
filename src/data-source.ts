import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "src/config/env.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [
    process.env.NODE_ENV === "production"
      ? "dist/modules/**/entities/*.entity.js"
      : "src/modules/**/entities/*.entity.ts",
  ],
  migrations: [],
  synchronize: true,
});
