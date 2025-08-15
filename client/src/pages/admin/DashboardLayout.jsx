import "src/assets/css/Sidebar.css"
import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiHome4Line,
  RiDraftLine,
  RiMailLine,
  RiLogoutBoxRLine,
  RiMegaphoneLine,
  RiUserHeartLine
} from "react-icons/ri";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem
} from "react-pro-sidebar";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

import useAuthStore from 'src/pages/auth/store';
import { EmailType } from 'src/utils/Constants'
import logo from 'src/assets/images/logo.png';



const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout()
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      <Sidebar
        style={{ height: "100%" }}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      >
        <main>
          <img className="w-40 mx-auto my-3" src={logo} alt="A descriptive alt text for my image" />
          <Menu>
            <MenuItem
              active={location.pathname === '/admins'}
              icon={<RiHome4Line />}
              component={
                <Link
                  to={"/admins"}
                  style={{ color: 'black', 'fontSize': '15px' }}
                />
              }
            >
              Home
            </MenuItem>
            <MenuItem
              active={location.pathname === '/admins/campaigns'}
              icon={<RiMegaphoneLine />}
              component={
                <Link
                  to={"/admins/campaigns"}
                  style={{ color: 'black', 'fontSize': '15px' }}
                />
              }
            >
              Campaigns
            </MenuItem>
            <MenuItem
              active={location.pathname === '/admins/campaigns/drafts'}
              icon={<RiDraftLine />}
              component={
                <Link
                  to={"/admins/campaigns/drafts"}
                  state={{ background: location.pathname }}
                  style={{ color: 'black', 'fontSize': '15px' }}
                />
              }
            >
              Campaign Draft
            </MenuItem>

            <MenuItem
              active={location.pathname === '/admins/donors'}
              icon={<RiUserHeartLine />}
              component={
                <Link
                  to={"/admins/donors"}
                  style={{ color: 'black', 'fontSize': '15px' }}
                />
              }
            >
              Donors
            </MenuItem>
            <SubMenu
              defaultOpen
              label={"Email Templates"}
              icon={<RiMailLine color="black" />}
              style={{ color: 'black', 'fontSize': '15px' }} >
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/receipt'}
                component={
                  <Link
                    to={"/admins/emails/email-template/receipt"}
                    state={{ background: location.pathname, emailType: EmailType.RECEIPT }}
                    style={{ color: 'black', 'fontSize': '15px' }}
                  />
                }
              >
                Receipt
              </MenuItem>
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/impact'}
                component={
                  <Link
                    to={"/admins/emails/email-template/impact"}
                    state={{ background: location.pathname, emailType: EmailType.IMPACT }}
                    style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
                  />
                }
              >
                Impact
              </MenuItem>
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/closeout'}
                component={
                  <Link
                    to={"/admins/emails/email-template/closeout"}
                    state={{ background: location.pathname, emailType: EmailType.CLOSEOUT }}
                    style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
                  />
                }
              >
                Closeout
              </MenuItem>

            </SubMenu>
            <MenuItem
              icon={<RiLogoutBoxRLine color="black" />}
              onClick={handleLogout}
              style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
            >
              Logout
            </MenuItem>
          </Menu>
        </main>
      </Sidebar>
      <main style={{ flexGrow: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div >

  )
};

export default DashboardLayout;