import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import axios from "axios";

interface Column {
  id:
    | "_id"
    | "image"
    | "name"
    | "email"
    | "mobile"
    | "designation"
    | "gender"
    | "course"
    | "createdAt"
    | "action";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "_id", label: "Unique ID", minWidth: 170 },
  { id: "image", label: "Image", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 170, align: "right" },
  { id: "email", label: "Email", minWidth: 300, align: "right" },
  { id: "mobile", label: "Mobile No", minWidth: 300, align: "right" },
  { id: "designation", label: "Designation", minWidth: 170, align: "right" },
  { id: "gender", label: "Gender", minWidth: 170, align: "right" },
  { id: "course", label: "Course", minWidth: 170, align: "right" },
  { id: "createdAt", label: "Create Date", minWidth: 300, align: "right" },
  { id: "action", label: "Action", minWidth: 170, align: "right" },
];

interface Data {
  _id: string;
  image: {
    url: string;
    public_id: string;
  };
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
  createdAt: string;
}

interface EmployeeTableProps {
  employees: Data[];
  setEmployees: React.Dispatch<React.SetStateAction<Data[]>>;
}

export default function EmployeeTable({
  employees = [],
  setEmployees,
}: EmployeeTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  if (!Array.isArray(employees)) {
    console.error("Expected employees to be an array. Received:", employees);
    employees = [];
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const token = useSelector((state: any) => state.auth.token);
  async function deleteEmployee(id: string, public_id: string) {
    try {
      console.log(public_id);
      const formdata = new FormData();
      formdata.append("public_id", public_id);
      await axios.delete(`http://localhost:8080/api/v1/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: formdata,
      });

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== id)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ my: 2, ml: 2 }}>
          Employee List
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/employees/create")}
        >
          Create Employee
        </Button>
        <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
          />
        </Box>
      </Box>
      <Divider />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                {columns.map((column) => {
                  const value = row[column.id as keyof Data];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === "image" ? (
                        <img
                          src={row.image.url}
                          alt={row.name}
                          style={{ width: "80px", height: "80px" }}
                        />
                      ) : column.id === "gender" ? (
                        value === "m" ? (
                          "Male"
                        ) : (
                          "Female"
                        )
                      ) : column.id === "course" ||
                        column.id === "designation" ? (
                        value.toUpperCase()
                      ) : column.id === "action" ? (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() =>
                              navigate(`/employees/${row._id}`, { state: row })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() =>
                              deleteEmployee(row._id, row.image.public_id)
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      ) : typeof value === "object" ? (
                        JSON.stringify(value)
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
