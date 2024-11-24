import { Box } from "@mui/material";
import Appbar from "../components/Appbar";
import EmployeeForm from "../components/EmployeeForm";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function CreateEmployee() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      course: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobile: Yup.string().required("Mobile is required"),
      designation: Yup.string().required("Designation is required"),
    }),
  });
  return (
    <>
      <Appbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          height: "auto",
        }}
      >
        <EmployeeForm formik={formik} />
      </Box>
    </>
  );
}
