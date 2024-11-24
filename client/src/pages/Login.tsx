import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { Box } from "@mui/material";

export default function Login() {
  const [isLogin, setIsLogin] = useState(() => true);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </Box>
    </>
  );
}
