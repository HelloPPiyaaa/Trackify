import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "./UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import type { Project } from "./types";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (project: Project) => void;
}

function CreateProjectModal({ onClose, onCreate }: CreateProjectModalProps) {
  const {
    userAuth: { access_token },
  } = useContext(UserContext)!;

  const [form, setForm] = useState({
    name: "",
    des: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name) {
      toast.error("Please Enter Project Name");
      return;
    }

    if (!form.des) {
      return toast.error("Please Enter Description");
    }

    if (!form.startDate) {
      return toast.error("Please Enter Start Date");
    }

    if (!form.endDate) {
      return toast.error("Please Enter End Date");
    }

    const newProject = {
      name: form.name,
      des: form.des,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    try {
      if (!access_token) {
        toast.error("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        newProject,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      onCreate(response.data);
      toast.success("Project created successfully!");
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Project creation failed. Try again.";
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="custom-modal">
          <div
            className="close-button"
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
            onKeyDown={(e) => e.key === "Enter" && onClose()}
          >
            <AiOutlineClose size={24} />
          </div>

          <h2>🚀Create New Project</h2>
          <form className="create-project-form" onSubmit={handleSubmit}>
            <label>
              Project Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Description:
              <textarea name="des" value={form.des} onChange={handleChange} />
            </label>

            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Create Project</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateProjectModal;
