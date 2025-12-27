import express, { type Express } from "express";
import "reflect-metadata";
import userRoutes from "src/modules/user/user.routes.js";

const app: Express = express();

app.use(express.json());

app.use("/users", userRoutes);

export default app;
