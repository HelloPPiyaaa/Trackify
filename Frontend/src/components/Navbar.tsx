import React, { useContext, useState } from "react";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "../misc/Navbar.css";
import { IoNotificationsOutline } from "react-icons/io5";

function Navbar() {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const navigate = useNavigate();
  const {
    userAuth: { access_token, profile_picture, username, fullname },
  } = useContext(UserContext)!;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;

    if (e.key === "Enter" && query.length) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <nav className="navbar-navbar">
      <div
        className={`search-container ${searchBoxVisibility ? "show" : "hide"} `}
      >
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onKeyDown={handleSearch}
        />
        <IoIosSearch className="icon-search" />
      </div>

      <div className="toggle-search">
        <div className="toggle-search-2">
          <button
            onClick={() => setSearchBoxVisibility((currentval) => !currentval)}
            className="search-toggle"
          >
            <IoIosSearch className="toggle-icon" />
          </button>
        </div>
        {access_token ? (
          <>
            <div className="relative">
              <button className=" mt-1 d-flex gap-3 align-items-center">
                <div
                  className="noti-icon bg-white  rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "35px", height: "35px" }}
                >
                  <IoNotificationsOutline className="fs-4 " />
                </div>
                <img
                  src={profile_picture}
                  className="img-fluid rounded-circle "
                  style={{ width: "45px", height: "45px" }}
                  alt=""
                />
                <div className="info ">
                  <p className="m-0 fw-semibold fs-6">{fullname}</p>
                  <p
                    className="m-0 text-secondary fs-6"
                    style={{ width: "fit-content" }}
                  >
                    {username}
                  </p>
                </div>
                <IoIosArrowDown className="fs-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              className="btn-dark py-2"
              to="/api/users/login"
              style={{ textDecoration: "none" }}
            >
              Sign in
            </Link>

            <Link
              className="btn-light py-2 hidden md:block"
              to="/api/users/register"
              style={{ textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
