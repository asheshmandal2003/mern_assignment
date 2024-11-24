import {
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const StyledDropzone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  textAlign: "center",
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function UpdateEmployeeForm() {
  const token = useSelector((state: any) => state.auth.token);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const {
    name,
    email,
    mobile,
    course,
    gender,
    image: imageProp,
    designation: desig,
  } = location.state || {};

  const [designation, setDesignation] = useState(desig || "");
  const [image, setImage] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      name: name || "",
      email: email || "",
      mobile: mobile || "",
      designation: desig || "",
      gender: gender || "m",
      course: course?.toUpperCase() || "BCA",
    },
    onSubmit: (_values) => {
      updateEmployee();
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required."),
      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required."),
      mobile: Yup.string().required("Mobile number is required."),
      designation: Yup.string().required("Designation is required."),
    }),
  });

  const handleChange = (event: SelectChangeEvent) => {
    setDesignation(event.target.value as string);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    },
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    onDropRejected: () => alert("File size must be under 2MB."),
  });

  const handleRemove = () => {
    setImage(null);
  };

  const handleCourseChange = (course: string) => {
    formik.setFieldValue("course", course);
  };

  const navigate = useNavigate();

  async function updateEmployee() {
    const formData = new FormData();
    formData.append("name", formik.values.name);
    formData.append("email", formik.values.email);
    formData.append("mobile", formik.values.mobile);
    formData.append("designation", designation);
    formData.append("gender", formik.values.gender);
    formData.append("course", formik.values.course.toLowerCase());
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("public_id", imageProp?.public_id || "");
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/employees/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }

  return (
    <Card
      sx={{
        width: 480,
        mb: 10,
        boxShadow: 3,
        borderRadius: 2,
        p: 3,
        bgcolor: "background.paper",
      }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <Stack spacing={3}>
        <Typography
          variant="h6"
          fontWeight={600}
          align="center"
          color="primary"
        >
          Update Employee
        </Typography>
        <Divider />
        <TextField
          name="name"
          label="Name"
          placeholder="Enter employee name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          name="email"
          label="Email"
          placeholder="example@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          name="mobile"
          label="Mobile"
          placeholder="10-digit number"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <FormControl fullWidth>
          <InputLabel>Designation</InputLabel>
          <Select
            value={designation}
            onChange={handleChange}
            label="Designation"
          >
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            value={formik.values.gender}
            onChange={formik.handleChange}
            name="gender"
          >
            <FormControlLabel value="m" control={<Radio />} label="Male" />
            <FormControlLabel value="f" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
        <FormGroup>
          <FormLabel component="legend">Course</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.course === "BCA"}
                onChange={() => handleCourseChange("BCA")}
              />
            }
            label="BCA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.course === "MCA"}
                onChange={() => handleCourseChange("MCA")}
              />
            }
            label="MCA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.course === "BSC"}
                onChange={() => handleCourseChange("BSC")}
              />
            }
            label="BSC"
          />
        </FormGroup>

        <Box>
          {!image ? (
            <StyledDropzone {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudUploadIcon fontSize="large" />
              <Typography>
                {isDragActive
                  ? "Drop the image here"
                  : "Drag and drop or click to select an image"}
              </Typography>
            </StyledDropzone>
          ) : (
            <Box position="relative" textAlign="center">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{ width: "100%", maxWidth: "300px", borderRadius: 8 }}
              />
              <IconButton onClick={handleRemove}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Button variant="contained" fullWidth type="submit">
          Update
        </Button>
      </Stack>
    </Card>
  );
}
