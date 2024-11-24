import { Document } from "mongoose";

export type Image_type = {
  public_id: string;
  url: string;
};

export interface IEmployee extends Document {
  image: Image_type;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
}
