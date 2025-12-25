import "reflect-metadata";
import app from "src/app.js";
import { env } from "src/config/env.js";
import { AppDataSource } from "src/data-source.js";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    const server = app.listen(env.app.port, () => {
      console.log(`Server is running on port ${env.app.port}`);
    });

    process.on("SIGINT", async () => {
      server.close();
      await AppDataSource.destroy();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

bootstrap();
