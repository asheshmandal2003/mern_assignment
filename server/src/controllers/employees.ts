import { Request, Response } from "express";
import { Employee } from "../db/models/employee";
import { uploadImg, deleteImg } from "../utils/imageOperations";

export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const employeeExists = await Employee.findOne({ email });
    if (employeeExists) {
      res.status(400).json({ message: "Employee already exists" });
      return;
    }
    const img = await uploadImg(req.file?.buffer as Buffer);
    const employee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image: {
        url: img.url as string,
        public_id: img.publicId as string,
      },
    });
    await employee.save();
    res
      .status(201)
      .json({ message: "Employee created successfully", data: employee });
  } catch (error) {
    res.status(400).json({ message: "Failed to create employee", error });
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await Employee.find({});
    res
      .status(200)
      .json({ message: "Employees retrieved successfully", data: employees });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve employees", error });
  }
};

export const getEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Employee retrieved successfully", data: employee });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve employee", error });
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.email) {
      const employeeExists = await Employee.findOne({ email: req.body.email });
      if (employeeExists) {
        res.status(400).json({ message: "Employee email already exists" });
        return;
      }
    }
    const { public_id } = req.body;
    if (req.file) {
      const img = await uploadImg(req.file.buffer);
      req.body.image = {
        url: img.url as string,
        public_id: img.publicId as string,
      };
      if (public_id) {
        await deleteImg(public_id);
      }
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update employee", error });
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.public_id) {
      res.status(400).json({ message: "public_id is required" });
      return;
    }
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    await deleteImg(req.body.public_id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete employee", error });
  }
};
