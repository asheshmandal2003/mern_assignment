import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token is required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.AUTH_TOKEN_SECRET as string,
      (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired token", error: err.message });
        }

        next();
      }
    );
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
