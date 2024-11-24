import { Box } from "@mui/material";
import Appbar from "../components/Appbar";
import UpdateEmployeeForm from "../components/UpdateEmployeeForm";

export default function UpdateEmployee() {
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
        <UpdateEmployeeForm />
      </Box>
    </>
  );
}
