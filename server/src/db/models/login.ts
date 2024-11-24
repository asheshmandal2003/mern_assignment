import { Schema, model } from "mongoose";
import { ILogin } from "../../interfaces/login_model";
import bcrypt from "bcrypt";

const loginSchema = new Schema<ILogin>(
  {
    userName: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

loginSchema.pre<ILogin>("save", async function (next) {
  if (!this.isModified("pwd")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.pwd = await bcrypt.hash(this.pwd, salt);

    next();
  } catch (error: any) {
    next(error);
  }
});

loginSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.pwd);
};

export const Login = model<ILogin>("Login", loginSchema);
