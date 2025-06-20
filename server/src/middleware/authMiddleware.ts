import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { blacklistedTokens } from "../utils/tokenBlacklist";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
