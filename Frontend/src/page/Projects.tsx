import { IoDocumentTextOutline } from "react-icons/io5";
import "../misc/Projects.css";
import { PiUsersThreeFill } from "react-icons/pi";
import { LuView } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import CreateProjectModal from "../components/CreateProjectModal";
import type { Issue, Project } from "../components/types";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { Link } from "react-router-dom";

const Projects = () => {
  const [showModal, setShowmodal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const {
    userAuth: { access_token },
  } = useContext(UserContext)!;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    const fetchIssues = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/issues`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setIssues(res.data);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };

    fetchIssues();

    fetchProjects();
  }, [access_token]);

  return (
    <>
      <Toaster />
      <div className="container">
        <div className="main1">
          <h1>Projects</h1>

          <div className="date-project d-flex justify-content-between align-items-center">
            <div className="date ">
              <input type="date" />
            </div>

            <div className="add-projects" onClick={() => setShowmodal(true)}>
              {" "}
              + Create Project
            </div>
          </div>

          {showModal && (
            <CreateProjectModal
              onClose={() => setShowmodal(false)}
              onCreate={(newProject) => setProjects([...projects, newProject])}
            />
          )}

          <div className="insights">
            <div className="user-all">
              <PiUsersThreeFill className="svg1" />
              <div className="middle">
                <div className="left">
                  <h3>Done</h3>
                  <h1>{issues.filter((i) => i.status === "Done").length}</h1>
                </div>
              </div>
              <small className="text-muted1">Last 24 Hour</small>
            </div>

            <div className="view-all">
              <LuView className="svg2" />
              <div className="middle">
                <div className="left">
                  <h3>InProgress</h3>
                  <h1>
                    {issues.filter((i) => i.status === "InProgress").length}
                  </h1>
                </div>
              </div>
              <small className="text-muted1">Last 24 Hour</small>
            </div>

            <div className="blogpost-all">
              <IoDocumentTextOutline className="svg3" />
              <div className="middle">
                <div className="left">
                  <h3>Open</h3>
                  <h1>{issues.filter((i) => i.status === "Open").length}</h1>
                </div>
              </div>
              <small className="text-muted1">Last 24 Hour</small>
            </div>
          </div>

          <div className="recent-order">
            <div className="search-user d-flex justify-content-between align-items-center">
              <h2> Project List</h2>

              <input
                type="text"
                placeholder="Search Project..."
                style={{
                  padding: "10px 15px",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              />
            </div>

            <div className="right" style={{ marginTop: "0.5rem" }}>
              <div className="activity-analytics">
                <table>
                  <thead className="pt-5">
                    <tr>
                      <th>Project Name</th>
                      <th>Description</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr key={project._id}>
                          <td>
                            <Link to={`/projects/${project._id}`}>
                              {project.name}
                            </Link>
                          </td>
                          <td>{project.des}</td>
                          <td>
                            {project.startDate
                              ? new Date(project.startDate).toLocaleDateString(
                                  "th-TH"
                                )
                              : "-"}
                          </td>
                          <td>
                            {project.endDate
                              ? new Date(project.endDate).toLocaleDateString(
                                  "th-TH"
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div
                            style={{ margin: "20px 0", textAlign: "center" }}
                          >
                            ไม่พบโปรเจกต์
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
