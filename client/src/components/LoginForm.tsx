import {
  Button,
  Card,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../store/auth";

interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export default function LoginForm({ isLogin, setIsLogin }: LoginFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(() => false);
  const formik = useFormik({
    initialValues: {
      userName: "",
      pwd: "",
    },
    onSubmit: (values) => {
      isLogin ? login(values) : register(values);
    },
    validationSchema: yup.object({
      userName: yup.string().required("Username is required"),
      pwd: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        ),
    }),
  });

  async function register(values: any) {
    const data = {
      userName: values.userName,
      pwd: values.pwd,
    };
    await axios
      .post("http://localhost:8080/api/v1/auth/register", data)
      .then((_res) => {
        setIsLogin(true);
        formik.resetForm();
      })
      .catch((err) => console.log(err));
  }

  async function login(values: any) {
    const data = {
      userName: values.userName,
      pwd: values.pwd,
    };
    await axios
      .post("http://localhost:8080/api/v1/auth/login", data)
      .then((res) => {
        dispatch(signin({ user: res.data.user, token: res.data.authToken }));
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Card
        sx={{ width: 450, height: 500, p: 4 }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Stack spacing={4} alignItems="center">
          <Typography variant="h5" justifySelf="center" color="primary">
            {isLogin ? "Login" : "Register"}
          </Typography>
          <TextField
            fullWidth
            name="userName"
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />
          <TextField
            fullWidth
            name="pwd"
            type={visibility ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            value={formik.values.pwd}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pwd && Boolean(formik.errors.pwd)}
            helperText={formik.touched.pwd && formik.errors.pwd}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setVisibility(!visibility)}>
                      {visibility ? "Hide" : "Show"}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" color="primary" fullWidth type="submit">
            {isLogin ? "Login" : "Register"}
          </Button>
          <Divider sx={{ width: "100%" }}>
            <Typography variant="overline">or</Typography>
          </Divider>
          <Typography variant="body1">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            {isLogin ? (
              <Button color="primary" onClick={() => setIsLogin(false)}>
                Register
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
            )}
          </Typography>
        </Stack>
      </Card>
    </>
  );
}
