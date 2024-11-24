import { Document } from "mongoose";

export interface ILogin extends Document {
  userName: string;
  pwd: string;
  refreshToken: string | null;
}
