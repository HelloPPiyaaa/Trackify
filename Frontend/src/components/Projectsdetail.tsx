import { useContext, useEffect, useState } from "react";
import "../misc/Projectdetail.css";
import { UserContext } from "./UserContext";
import { useParams } from "react-router-dom";
import type { Project, Issue } from "./types";
import axios from "axios";
import { MdOutlineDescription } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { Nav } from "react-bootstrap";
import CreateIssueModal from "./CreateIssueModal";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditStatusModal from "./EditStatusModal";
import ConfirmDeleteModal from "./confirmDelete";
import { AiOutlineDelete } from "react-icons/ai";

const ProjectDetail = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "Open" | "InProgress" | "Done"
  >("Open");
  const [showModal, setShowmodal] = useState(false);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [editStatusModalIssue, setEditStatusModalIssue] =
    useState<Issue | null>(null);
  const [confirmDeleteModalShow, setConfirmDeleteModalShow] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);
  const [confirmDeleteProjectShow, setConfirmDeleteProjectShow] =
    useState(false);

  const { projectId } = useParams();
  const {
    userAuth: { access_token },
  } = useContext(UserContext)!;

  useEffect(() => {
    const fetchProjectAndIssues = async () => {
      try {
        const [projectRes, issuesRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/projects/${projectId}/issues`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          ),
        ]);

        setProject(projectRes.data);
        setIssues(issuesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (projectId) {
      fetchProjectAndIssues();
    }
  }, [projectId, access_token]);

  const filteredIssues = issues.filter(
    (issue) => issue.status === selectedStatus
  );

  return (
    <div className="project-detail">
      {project ? (
        <div className="main1">
          <h1>{project.name}</h1>

          <div className="detail">
            <div className="icon-detail">
              <div className="des-detail d-flex align-items-center">
                <MdOutlineDescription />
                <p className="m-0">description: {project.des}</p>
              </div>
              <div className="des-detail d-flex align-items-center">
                <CiCalendar />
                <p className="m-0">
                  Start:{" "}
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString("th-TH")
                    : "-"}
                </p>
              </div>
              <div className="des-detail d-flex align-items-center">
                <CiCalendar />
                <p className="m-0">
                  End:{" "}
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString("th-TH")
                    : "-"}
                </p>
              </div>

              <div className="delete-button d-flex justify-content-end align-items-center position-absolute">
                <div
                  className="delete-project "
                  onClick={() => setConfirmDeleteProjectShow(true)}
                >
                  <AiOutlineDelete /> Delete
                </div>
              </div>
            </div>
          </div>

          <div className="issue-button d-flex justify-content-end w-100">
            <div className="add-issue" onClick={() => setShowmodal(true)}>
              + Add Issue
            </div>
          </div>

          {showModal && (
            <CreateIssueModal
              projectId={projectId!}
              onClose={() => setShowmodal(false)}
              onSubmit={(newIssue) => setIssues([...issues, newIssue])}
            />
          )}

          <Nav
            fill
            variant="underline"
            activeKey={selectedStatus}
            className="mt-3"
            onSelect={(status) => {
              if (
                status === "Open" ||
                status === "InProgress" ||
                status === "Done"
              ) {
                setSelectedStatus(status);
              }
            }}
          >
            <Nav.Item>
              <Nav.Link eventKey="Open">Open</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="InProgress">In Progress</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Done">Done</Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="issue-list mt-3">
            {filteredIssues.length > 0 ? (
              <div className="row g-3">
                {filteredIssues.map((issue) => (
                  <div className="col-md-4" key={issue._id}>
                    <div className="card shadow-sm h-100 rounded-4">
                      <div className="card-body">
                        <div className="d-flex  justify-content-between">
                          <div
                            className={`priority-badge d-flex align-items-center gap-2 w-25 rounded-4 p-1 justify-content-center
    ${issue.priority === "High" ? "bg-danger bg-opacity-25" : ""}
    ${issue.priority === "Medium" ? "bg-warning bg-opacity-25" : ""}
    ${issue.priority === "Low" ? "bg-success bg-opacity-25" : ""}
  `}
                          >
                            {issue.priority === "High" && (
                              <FcHighPriority size={20} />
                            )}
                            {issue.priority === "Medium" && (
                              <FcMediumPriority size={20} />
                            )}
                            {issue.priority === "Low" && (
                              <FcLowPriority size={20} />
                            )}
                            <p className="fs-6 m-0">{issue.priority}</p>
                          </div>

                          <div className="d-flex justify-content-end">
                            <div
                              className="position-relative"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setShowMenuId(
                                  showMenuId === issue._id ? null : issue._id
                                )
                              }
                            >
                              <BsThreeDotsVertical />

                              {showMenuId === issue._id && (
                                <div
                                  className="position-absolute bg-light border rounded-3 p-2"
                                  style={{ top: "20px", right: 0, zIndex: 10 }}
                                >
                                  <div
                                    className="dropdown-item"
                                    onClick={() => {
                                      setEditStatusModalIssue(issue);
                                      setShowMenuId(null);
                                    }}
                                  >
                                    📝 Edit Status
                                  </div>

                                  <div
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setIssueToDelete(issue);
                                      setConfirmDeleteModalShow(true);
                                      setShowMenuId(null);
                                    }}
                                  >
                                    🗑️ Delete
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {editStatusModalIssue && (
                            <EditStatusModal
                              issue={editStatusModalIssue}
                              access_token={access_token}
                              onClose={() => setEditStatusModalIssue(null)}
                              onSave={(updatedIssue) => {
                                setIssues((prev) =>
                                  prev.map((i) =>
                                    i._id === updatedIssue._id
                                      ? updatedIssue
                                      : i
                                  )
                                );
                              }}
                            />
                          )}
                        </div>

                        <h5 className="card-title mt-2">{issue.title}</h5>
                        <p className="card-text small text-muted">
                          {issue.description}
                        </p>
                        <p className="card-text">
                          <strong>Due:</strong>{" "}
                          {issue.dueDate
                            ? new Date(issue.dueDate).toLocaleDateString(
                                "th-TH"
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">ไม่มี issue ในสถานะนี้</p>
            )}

            <ConfirmDeleteModal
              show={confirmDeleteModalShow}
              onCancel={() => {
                setConfirmDeleteModalShow(false);
                setIssueToDelete(null);
              }}
              onConfirm={async () => {
                if (!issueToDelete) return;
                try {
                  await axios.delete(
                    `${import.meta.env.VITE_API_URL}/api/issues/${
                      issueToDelete._id
                    }`,
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`,
                      },
                    }
                  );
                  setIssues((prev) =>
                    prev.filter((i) => i._id !== issueToDelete._id)
                  );
                } catch (err) {
                  console.error("Error deleting issue:", err);
                } finally {
                  setConfirmDeleteModalShow(false);
                  setIssueToDelete(null);
                }
              }}
            />

            <ConfirmDeleteModal
              show={confirmDeleteProjectShow}
              onCancel={() => setConfirmDeleteProjectShow(false)}
              onConfirm={async () => {
                try {
                  await axios.delete(
                    `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`,
                      },
                    }
                  );

                  window.location.href = "/projects";
                } catch (err) {
                  console.error("Error deleting project:", err);
                }
              }}
              message="Are you sure you want to delete this project?"
            />
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>ไม่พบโปรเจกต์</p>
      )}
    </div>
  );
};

export default ProjectDetail;
