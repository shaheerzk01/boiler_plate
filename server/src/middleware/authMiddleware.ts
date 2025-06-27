import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { blacklistedTokens } from "../utils/tokenBlacklist";

const JWT_SECRET =
  "8569f9f588732049cf1b865aeac62c9c0deb07fab4ee19dd30e77876ec987714adeea3bbb0f08a2b8ba08702a10f91ce98f97a007531b15996b79b3653bc0627";


export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (blacklistedTokens.has(token)) {
    res
      .status(401)
      .json({ message: "Token is blacklisted. Please login again." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
