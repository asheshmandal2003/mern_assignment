import CreateEmployee from "./pages/CreateEmployee";
import Employees from "./pages/Employees";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import UpdateEmployee from "./pages/UpdateEmployee";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<CreateEmployee />} />
        <Route path="/employees/:id" element={<UpdateEmployee />} />
      </Routes>
    </>
  );
}

export default App;
