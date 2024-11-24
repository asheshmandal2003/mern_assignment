import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "dotenv";

config();

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const AUTH_TOKEN_LIFETIME = process.env.AUTH_TOKEN_LIFETIME || "1h";
const REFRESH_TOKEN_LIFETIME = process.env.REFRESH_TOKEN_LIFETIME || "7d";

export const generateAuthToken = (payload: object) => {
  return jwt.sign(payload, AUTH_TOKEN_SECRET, {
    expiresIn: AUTH_TOKEN_LIFETIME,
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFETIME,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload | string => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
