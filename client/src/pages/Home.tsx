import { Box } from "@mui/material";
import Dashboard from "../components/Dashboard";
import Appbar from "../components/Appbar";

export default function () {
  return (
    <>
      <Appbar />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Dashboard />
      </Box>
    </>
  );
}
