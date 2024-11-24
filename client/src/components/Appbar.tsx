import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { logout } from "../store/auth";

export default function Appbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const signout = () => {
    dispatch(logout());
    navigate("/auth");
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate("/employees")}>
              Employee List
            </Button>
          </Box>
          <Box
            ml="auto"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Typography variant="body1">{user.userName}</Typography>-{" "}
            <Button color="inherit" onClick={signout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
