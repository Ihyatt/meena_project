import AdminSideBar from "./AdminSideBar";

const DashboardLayout = () => {
  return (
    <AdminSideBar>
      <Outlet />
    </AdminSideBar>
  );
};

export default DashboardLayout;
