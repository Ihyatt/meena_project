import AdminSideBar from "src/pages/admin/AdminSideBar";
import { Link, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <AdminSideBar>
      <Outlet />
    </AdminSideBar>
  );
};

export default DashboardLayout;
