import { Box, Card, Divider, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Card
      sx={{
        width: 600,
        p: 5,
        mt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4">Dashboard</Typography>
      <Divider sx={{ width: "100%", mt: 2 }} />
      <Box
        sx={{
          width: "100%",
          p: 2,
          mt: 5,
          bgcolor: "background.paper",
          borderRadius: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5">Welcome to Admin Panel</Typography>
      </Box>
    </Card>
  );
}
