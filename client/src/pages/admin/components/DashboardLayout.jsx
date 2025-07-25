import "src/assets/css/Sidebar.css"
import { Outlet } from "react-router-dom";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiHome4Line,
  RiDraftLine,
  RiMailLine,
  RiLogoutBoxRLine
} from "react-icons/ri";
import {
  Sidebar,
  SubMenu,
  Menu,
  MenuItem
} from "react-pro-sidebar";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

import useAuthStore from 'src/stores/Auth';
import { EmailType } from 'src/utils/Constants'



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
          <Menu>

            <MenuItem
            >
              <div
                style={{
                  padding: "9px",
                  fontWeight: "bold",
                  fontSize: 14,
                  letterSpacing: "1px"
                }}
              >
                Meena
              </div>
            </MenuItem>

          </Menu>

          <Menu>
            <MenuItem
              icon={<RiHome4Line color="black" fontSize='15px' />} style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
            >
              Home
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
            <SubMenu
              defaultOpen
              label={"Email Templates"}
              icon={<RiMailLine color="black" />}
              style={{ color: 'black', 'fontSize': '15px' }} >
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/donation-receipt'}
                component={
                  <Link
                    to={"/admins/emails/email-template/donation-receipt"}
                    state={{ background: location.pathname, emailType: EmailType.DONATION_RECEIPT }}
                    style={{ color: 'black', 'fontSize': '15px' }}
                  />
                }
              >
                Donation Receipt
              </MenuItem>
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/campaign-update'}
                component={
                  <Link
                    to={"/admins/emails/email-template/campaign-update"}
                    state={{ background: location.pathname, emailType: EmailType.CAMPAIGN_UPDATE }}
                    style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
                  />
                }
              >
                Update Campaign
              </MenuItem>
              <MenuItem
                active={location.pathname === '/admins/emails/email-template/campaign-close'}
                component={
                  <Link
                    to={"/admins/emails/email-template/campaign-close"}
                    state={{ background: location.pathname, emailType: EmailType.CAMPAIGN_CLOSE }}
                    style={{ color: 'black', textDecoration: 'none', 'fontSize': '15px' }}
                  />
                }
              >
                Close Campaign
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