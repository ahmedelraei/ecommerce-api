import express, { type Express } from "express";
import "reflect-metadata";
import userRoutes from "src/modules/user/user.routes.js";
import authRoutes from "src/modules/auth/auth.routes.js";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
