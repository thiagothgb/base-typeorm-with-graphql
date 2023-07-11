import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { createClient } from "redis";
import AppError from "@shared/errors/AppError";

const redisClient = createClient({
  disableOfflineQueue: false,
  legacyMode: true,
  socket: {
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient
  .connect()
  .then(() => console.log("Redis instance of rate limiter ready."))
  .catch((err) =>
    console.error("Error on redis connect for rate limiter", err.message),
  );

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "ratelimit",
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  limiter
    .consume(request.ip)
    .then((rateLimiterRes) => {
      return next();
    })
    .catch((rateLimiterRes) => {
      console.log("redis catch", rateLimiterRes);
      // Not enough points to consume
      const headers = {
        "Retry-After": rateLimiterRes.msBeforeNext / 1000,
        "X-RateLimit-Limit": 10,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
      };
      response.headers = { ...(response.headers || {}), headers };
      throw new AppError("Too Many Requests", 429);
    });
}
