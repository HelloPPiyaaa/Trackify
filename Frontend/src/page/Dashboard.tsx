import { Nav } from "react-bootstrap";
import "../misc/Dashboard.css";
import { LuView } from "react-icons/lu";
import { PiUsersThreeFill } from "react-icons/pi";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import type { Issue, Project } from "../components/types";

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState<"Projects" | "Issues">(
    "Projects"
  );
  const {
    userAuth: { access_token },
  } = useContext(UserContext)!;

  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    const fetchProjectsAndIssues = async () => {
      try {
        const projectsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        const projectsData = projectsRes.data;
        setProjects(projectsData);

        const allIssues: Issue[] = [];
        await Promise.all(
          projectsData.map(async (project: Project) => {
            const issuesRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/projects/${
                project._id
              }/issues`,
              {
                headers: { Authorization: `Bearer ${access_token}` },
              }
            );
            allIssues.push(...issuesRes.data);
          })
        );

        setIssues(allIssues);
      } catch (err) {
        console.error("Error fetching projects or issues:", err);
      }
    };

    fetchProjectsAndIssues();

    fetchProjects();
  }, [access_token]);

  return (
    <div className="main1">
      <h1>Dashboard</h1>

      <div className="date ">
        <input type="date" />
      </div>

      <div className="insights">
        <div className="user-all">
          <PiUsersThreeFill className="svg1" />
          <div className="middle">
            <div className="left">
              <h3>All Projects</h3>
              <h1>{projects.length}</h1>
            </div>
          </div>
          <small className="text-muted1">Last 24 Hour</small>
        </div>

        <div className="view-all">
          <LuView className="svg2" />
          <div className="middle">
            <div className="left">
              <h3>All Issues</h3>
              <h1>{issues.length}</h1>
            </div>
          </div>
          <small className="text-muted1">Last 24 Hour</small>
        </div>
      </div>

      <Nav
        fill
        variant="underline"
        activeKey={selectedStatus}
        className="mt-3"
        onSelect={(status) => {
          if (status === "Projects" || status === "Issues") {
            setSelectedStatus(status);
          }
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="Projects">Projects</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Issues">Issues</Nav.Link>
        </Nav.Item>
      </Nav>

      {selectedStatus === "Projects" && (
        <div className="recent-order mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2>Project List</h2>

            <input
              type="text"
              placeholder="Search Project..."
              style={{
                padding: "10px 15px",
                fontSize: "16px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "white",
                marginBottom: "1rem",
              }}
            />
          </div>

          <table>
            <thead>
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
                        ? new Date(project.endDate).toLocaleDateString("th-TH")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    ไม่พบโปรเจกต์
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedStatus === "Issues" && (
        <div className="recent-order mt-3">
          <h2>Issue List</h2>
          {issues.length === 0 ? (
            <p>ไม่พบ Issue</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Issue Name</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td>{issue.title}</td>
                    <td>{issue.description}</td>
                    <td>
                      {issue.dueDate
                        ? new Date(issue.dueDate).toLocaleDateString("th-TH")
                        : "-"}
                    </td>
                    <td>{issue.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
