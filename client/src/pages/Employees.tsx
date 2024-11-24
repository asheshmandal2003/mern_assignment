import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import EmployeeTable from "../components/EmployeeTable";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Employees() {
  const token = useSelector((state: any) => state.auth.token);
  const [employees, setEmployees] = useState<any[]>([]);
  useEffect(() => {
    async function fetchEmployees() {
      await axios
        .get("http://localhost:8080/api/v1/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          setEmployees(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchEmployees();
  }, []);
  return (
    <>
      <Appbar />
      <EmployeeTable employees={employees} setEmployees={setEmployees} />
    </>
  );
}
