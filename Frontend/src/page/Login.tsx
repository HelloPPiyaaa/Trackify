import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../components/UserContext";
import { storeInSession, userInSession } from "../components/session";
import "../misc/Login.css";

function Login() {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext)!;
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit called");

    const { email, password } = formData;

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!emailRegex.test(email)) {
      return toast.error("Email Invalid");
    }

    if (!email.length) {
      return toast.error("Please Enter Email");
    }

    if (password.includes(" ")) {
      return toast.error("Password must not contain spaces ");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Invalid password format. Must contain uppercase, lowercase, and number (6–20 characters)."
      );
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        formData
      );

      const data = res.data;

      storeInSession("user", JSON.stringify(data));
      userInSession("userId", data._id || "");

      console.log("res.data", res.data);

      setUserAuth(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "เข้าสู่ระบบล้มเหลว");
      }
    }
  };

  console.log("access_token", access_token);

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <section className="h-cover d-flex align-items-center justify-content-center">
      <Toaster />
      <form id="formElement" className="custom-form" onSubmit={handleSubmit}>
        <h1 className="custom-heading">Welcome Back!</h1>

        <input
          name="email"
          type="email"
          value={formData.email}
          id="email"
          placeholder="Email"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          id="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />

        <p className="text text-r">
          <Link to="/forgot-password-user">Forgot Password</Link>
        </p>

        <button className="btn-dark center" type="submit">
          Log in
        </button>
      </form>
    </section>
  );
}

export default Login;
