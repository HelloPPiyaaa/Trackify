import { Link, NavLink, useNavigate } from "react-router-dom";
import "../misc/sidebar.css";
import logo from "../assets/logo-web.png";
import { FiLogOut } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { useContext } from "react";
import { UserContext } from "./UserContext";

function Navbar() {
  const { setUserAuth } = useContext(UserContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setUserAuth({ access_token: "" });
    navigate("/");
  };

  return (
    <nav className="side">
      <div className="contain">
        <aside>
          <div className="top">
            <div className="logo align-items-center">
              <img src={logo} alt="" />
              <h2 className="m-0 ">Trackify</h2>
            </div>
            <div id="close">
              <AiOutlineClose />
            </div>
          </div>

          <div className="sidebar">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <RiDashboardFill />
              <h3>Dashboard</h3>
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <TiDocumentText />
              <h3>Projects</h3>
            </NavLink>

            <Link to="" onClick={handleLogout}>
              <FiLogOut />
              <h3>ออกจากระบบ</h3>
            </Link>
          </div>
        </aside>

        <div className="content-container">
          <div
            className="header-profile-admin"
            style={{
              marginBottom: "0",
            }}
          >
            <div className="profile-theme">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>

              {/* {access_token && (
                  <div className="profile">
                    <div className="info">
                      <p style={{ fontSize: "14px", marginTop: "30px" }}>
                        Hello, <b>{username}</b>
                      </p>
                    </div>
                    <div
                      className="profile-photo"
                      style={{ marginTop: "15px" }}
                    >
                      <img src={profile_picture} alt="Profile" />
                    </div>
                  </div>
                )} */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
