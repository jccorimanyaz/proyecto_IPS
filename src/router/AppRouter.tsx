import Home from "../pages/Home";
import List from "../pages/List";
import Login from "../pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Pool from "../pages/Pool";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<List/>} />
      <Route path="/*" element={<Navigate to="/" />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/pool" element={<Pool/>} />
    </Routes>
  );
};

export default AppRouter;
