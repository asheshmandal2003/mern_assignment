import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registerSchema = Joi.object({
      userName: Joi.string().alphanum().min(3).max(50).required().messages({
        "string.base": "Username must be a string!",
        "string.empty": "Username is required!",
        "string.alphanum":
          "Username must only contain alphanumeric characters!",
        "string.min": "Username must have atleast {#limit} characters!",
        "string.max": "Username cannot have more than {#limit} characters!",
        "any.required": "Username is required!",
      }),
      pwd: Joi.string()
        .min(8)
        .max(32)
        .pattern(new RegExp(PASSWORD_REGEX))
        .required()
        .messages({
          "string.base": "Password must be a string!",
          "string.empty": "Password is required!",
          "string.min": "Password must have atleast {#limit} characters!",
          "string.max": "Password cannot have more than {#limit} characters!",
          "string.pattern.base":
            "Password must have atleast 1 digit, 1 special character, and 1 uppercase letter!",
          "any.required": "Password is required!",
        }),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    return;
  }
};
