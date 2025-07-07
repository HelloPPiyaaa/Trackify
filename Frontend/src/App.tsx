import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./page/Dashboard";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import type { User } from "./components/types";
import Register from "./page/Register";
import Login from "./page/Login";
import { UserContext } from "./components/UserContext";
import { lookInSession } from "./components/session";
import Navbar from "./components/Navbar";
import ProjectDetail from "./components/Projectsdetail";
import Projects from "./page/Projects";
import "./App.css";

function NavbarLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="scrollable-content">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const [userAuth, setUserAuth] = useState<User>(() => {
    const userInSession = lookInSession("user");
    return userInSession ? JSON.parse(userInSession) : { access_token: null };
  });

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />

          <Route path="/api/users/register" element={<Register />} />
          <Route path="/api/users/login" element={<Login />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
