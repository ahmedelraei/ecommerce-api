import express, { type Express } from "express";
import "reflect-metadata";

const app: Express = express();

app.use(express.json());

export default app;
