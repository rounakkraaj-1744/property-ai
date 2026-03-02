import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "./config/logger";

export const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});