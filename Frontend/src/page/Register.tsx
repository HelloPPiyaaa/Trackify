import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../components/UserContext";
import { storeInSession, userInSession } from "../components/session";
import "../misc/Login.css";

function Register() {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext)!;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullname, email, password, confirmPassword } = formData;

    if (!fullname.trim()) {
      return toast.error("กรุณากรอกชื่อ");
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return toast.error("อีเมลไม่ถูกต้อง");
    }

    if (!email.length) {
      return toast.error("กรุณากรอกอีเมล");
    }

    if (password.includes(" ")) {
      return toast.error("รหัสผ่านห้ามมีช่องว่าง");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!passwordRegex.test(password)) {
      return toast.error(
        "รูปแบบรหัสผ่านไม่ถูกต้อง ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข (6–20 ตัวอักษร)"
      );
    }

    if (password !== confirmPassword) {
      return toast.error("รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน");
    }

    console.log("formData:", formData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        { fullname, email, password, confirmPassword }
      );

      const data = res.data;

      storeInSession("user", JSON.stringify(data));
      userInSession("userId", data._id || "");

      toast.success("สมัครสมาชิกสำเร็จ");

      setUserAuth(data);

      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(error.response?.data?.error || "สมัครสมาชิกไม่สำเร็จ");
      } else {
        toast.error("สมัครสมาชิกไม่สำเร็จ");
      }
    }
  };

  if (access_token) {
    return <Navigate to="/" />;
  }

  return (
    <section className="h-cover d-flex align-items-center justify-content-center">
      <Toaster />
      <form className="custom-form" onSubmit={handleSubmit}>
        <h1 className="custom-heading">Register</h1>

        <input
          name="fullname"
          type="fullname"
          placeholder="Fullname"
          value={formData.fullname}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
        />

        <button className="btn-dark center" type="submit">
          Register
        </button>

        <p className="text text-r mt-2">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
