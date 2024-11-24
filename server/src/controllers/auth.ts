import { Login } from "../db/models/login";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAuthToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { config } from "dotenv";

config();

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, pwd } = req.body;
    const user = new Login({ userName, pwd });
    await user.save();
    const res_user = { sno: user._id, userName: user.userName };
    res
      .status(201)
      .json({ message: "User created successfully", user: res_user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, pwd } = req.body;
    const user = await Login.findOne({ userName });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPwdMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isPwdMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const authToken = generateAuthToken({ sno: user._id });
    const refreshToken = generateRefreshToken({ sno: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    const res_user = { sno: user._id, userName: user.userName };

    res.status(200).json({
      message: "User logged in successfully",
      user: res_user,
      authToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshAuthToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const user = await Login.findOne({ refreshToken });
    if (!user) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const payload = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    if (!payload) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAuthToken = generateAuthToken({ sno: user._id });

    res.json({ authToken: newAuthToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { sno } = req.body;

  try {
    const user = await Login.findById(sno);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
