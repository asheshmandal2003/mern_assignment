import { Schema, model } from "mongoose";
import { Image_type, IEmployee } from "../../interfaces/employee_model";

const imageSchema = new Schema<Image_type>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});

const employeeSchema = new Schema<IEmployee>(
  {
    image: { type: imageSchema, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
  },
  { timestamps: true }
);

export const Employee = model<IEmployee>("Employee", employeeSchema);
