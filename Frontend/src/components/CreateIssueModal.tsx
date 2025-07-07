import React, { useContext, useState } from "react";
import type { Issue } from "./types";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

interface CreateIssueModalProps {
  onClose: () => void;
  onSubmit: (issue: Issue) => void;
  projectId: string;
}

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  onClose,
  onSubmit, projectId
}) => {
  const {
    userAuth: { access_token },
  } = useContext(UserContext)!;
  const [form, setForm] = useState({
    title: "",
    status: "Open",
    description: "",
    priority: "Medium",
    dueDate: "",
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

    if (!form.status) {
      toast.error("Please Enter Issue Tiitle");
      return;
    }

    if (!form.description) {
      return toast.error("Please Enter Description");
    }

    if (!form.status) {
      return toast.error("Please Enter Status");
    }

    if (!form.priority) {
      return toast.error("Please Enter priority");
    }

    if (!form.dueDate) {
      return toast.error("Please Enter dueDate");
    }

    const newIssue = {
      title: form.title,
      status: form.status,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate,
    };

    try {
      if (!access_token) {
        toast.error("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/issues`,
        newIssue,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      onSubmit(response.data);
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

        <h2>🚀Create New Issue</h2>
        <form className="create-project-form" onSubmit={handleSubmit}>
          <label>
            Issue Name:
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="row">
            <label>
              Status:
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </label>

            <label>
              Priority:
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <label>
            Deadline:
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueModal;
