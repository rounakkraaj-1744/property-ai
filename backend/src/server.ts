import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";
import { redis, disconnectRedis } from "./config/redis";

const PORT = Number(env.PORT);

const server = app.listen(PORT, () => {
  logger.info(`Server running on  http://localhost:${PORT}`);
});

const shutdown = async () => {
  logger.info("Shutting down server...");
  server.close(async () => {
    logger.info("HTTP server closed.");
    await prisma.$disconnect();
    await disconnectRedis();
    logger.info("All connections closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("uncaughtException", (err) => {
  logger.error(err, "Uncaught Exception");
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logger.error(reason, "Unhandled Rejection");
  process.exit(1);
});