import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const MOBILE_NO_REGEX = /^\+?\d{1,4}[-.\s]?\d{10}$/;

export const validateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Name must be a string!",
        "string.empty": "Name is required!",
        "string.min": "Name must have at least {#limit} characters!",
        "string.max": "Name cannot have more than {#limit} characters!",
      }),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "string.base": "Email must be a string!",
          "string.empty": "Email is required!",
          "string.email": "Invalid email address!",
          "any.required": "Email is required!",
        }),
      mobile: Joi.string().pattern(MOBILE_NO_REGEX).required().messages({
        "string.base": "Mobile number must be a string!",
        "string.empty": "Mobile number is required!",
        "string.pattern.base": "Invalid mobile number!",
        "any.required": "Mobile number is required!",
      }),
      designation: Joi.string()
        .valid("hr", "manager", "sales")
        .required()
        .messages({
          "string.base": "Designation must be a string!",
          "string.empty": "Designation is required!",
          "any.only": "Invalid designation!",
          "any.required": "Designation is required!",
        }),
      gender: Joi.string().valid("m", "f").required().messages({
        "string.base": "Gender must be a string!",
        "string.empty": "Gender is required!",
        "any.only": "Invalid gender!",
        "any.required": "Gender is required!",
      }),
      course: Joi.string().valid("mca", "bca", "bsc").required().messages({
        "string.base": "Course must be a string!",
        "string.empty": "Course is required!",
        "any.only": "Invalid course!",
        "any.required": "Course is required!",
      }),
    });

    const { error: bodyError } = registerSchema.validate(req.body);
    if (bodyError) {
      res.status(400).json({ error: bodyError.details[0].message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "Image file is required!" });
      return;
    }

    const fileToValidate = {
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    const fileValidationSchema = Joi.object({
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png")
        .required()
        .messages({
          "any.only": "Only JPEG or PNG formats are allowed.",
          "any.required": "Image file type is required.",
        }),
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .required()
        .messages({
          "number.max": "Image size must not exceed 5MB.",
          "any.required": "Image size is required.",
        }),
    });

    const { error: fileError } = fileValidationSchema.validate(fileToValidate);
    if (fileError) {
      res.status(400).json({ error: fileError.details[0].message });
      return;
    }

    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const validateUpdateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateEmployeeSchema = Joi.object({
      name: Joi.string().min(3).max(100).messages({
        "string.base": "Name must be a string!",
        "string.min": "Name must have at least {#limit} characters!",
        "string.max": "Name cannot have more than {#limit} characters!",
      }),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .messages({
          "string.base": "Email must be a string!",
          "string.email": "Invalid email address!",
        }),
      mobile: Joi.string().pattern(MOBILE_NO_REGEX).messages({
        "string.base": "Mobile number must be a string!",
        "string.pattern.base": "Invalid mobile number format!",
      }),
      designation: Joi.string().valid("hr", "manager", "sales").messages({
        "string.base": "Designation must be a string!",
        "any.only": "Designation must be one of 'hr', 'manager', or 'sales'!",
      }),
      gender: Joi.string().valid("m", "f").messages({
        "string.base": "Gender must be a string!",
        "any.only": "Gender must be either 'm' (male) or 'f' (female)!",
      }),
      course: Joi.string().valid("mca", "bca", "bsc").messages({
        "string.base": "Course must be a string!",
        "any.only": "Course must be one of 'mca', 'bca', or 'bsc'!",
      }),
      public_id: Joi.string().messages({
        "string.base": "Public ID must be a string!",
      }),
    })
      .or(
        "name",
        "email",
        "mobile",
        "designation",
        "gender",
        "course",
        "public_id"
      )
      .messages({
        "object.missing": "At least one field must be provided for update!",
      });
    const { error } = updateEmployeeSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const fileToValidate = {
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    };

    const fileValidationSchema = Joi.object({
      mimetype: Joi.string()
        .valid("image/jpeg", "image/png")
        .required()
        .messages({
          "any.only": "Only JPEG or PNG formats are allowed.",
          "any.required": "Image file type is required.",
        }),
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .messages({
          "number.max": "Image size must not exceed 5MB.",
          "any.required": "Image size is required.",
        }),
    });

    const { error: fileError } = fileValidationSchema.validate(fileToValidate);
    if (fileError) {
      res.status(400).json({ error: fileError.details[0].message });
      return;
    }
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
