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
import { FormikProps } from "formik";
import { useSelector } from "react-redux";

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

interface EmployeeFormProps {
  formik: FormikProps<{
    name: string;
    email: string;
    mobile: string;
    designation: string;
    gender: string;
    course: string;
  }>;
}

export default function EmployeeForm({ formik }: EmployeeFormProps) {
  const [designation, setDesignation] = useState("hr");
  const [image, setImage] = useState<File | null>(null);

  const token = useSelector((state: any) => state.auth.token);

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
      "image/*": ["png", "jpeg"],
    },
    maxFiles: 1,
  });

  const handleRemove = () => {
    setImage(null);
  };

  const handleCourseChange = (course: string) => {
    formik.setFieldValue("course", course);
  };

  const createEmployee = async () => {
    const formData = new FormData();
    formData.append("name", formik.values.name);
    formData.append("email", formik.values.email);
    formData.append("mobile", formik.values.mobile);
    formData.append("designation", designation);
    formData.append("gender", formik.values.gender);
    formData.append("course", formik.values.course.toLowerCase());
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/employees",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      formik.resetForm();
      setImage(null);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <Card sx={{ width: 480, height: "auto", mb: 10 }}>
      <Stack spacing={4} p={4}>
        <Typography
          variant="h6"
          fontWeight={600}
          alignSelf="center"
          color="primary"
        >
          Create Employee
        </Typography>
        <Divider />
        <TextField
          name="name"
          type="text"
          label="Name"
          placeholder="Enter employee name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          name="email"
          type="email"
          label="Email"
          placeholder="johndoe@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          name="mobile"
          type="text"
          label="Mobile No"
          placeholder="Enter employee mobile number (e.g., 9876543210)"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <FormControl fullWidth>
          <InputLabel>Designation</InputLabel>
          <Select
            value={designation}
            label="Designation"
            onChange={handleChange}
          >
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row-reverse" justifyContent="space-around">
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
        </Stack>
        <Box sx={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
          {!image ? (
            <StyledDropzone {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag & drop an image or click to select"}
              </Typography>
            </StyledDropzone>
          ) : (
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded Preview"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "white",
                }}
                onClick={handleRemove}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          )}
          {image && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">File: {image.name}</Typography>
              <Typography variant="body2">
                Size: {(image.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          )}
        </Box>
        <Button variant="contained" fullWidth onClick={createEmployee}>
          Create
        </Button>
      </Stack>
    </Card>
  );
}
