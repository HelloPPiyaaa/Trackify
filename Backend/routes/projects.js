const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Project = require("../models/Project");
const Issue = require("../models/Issue");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.status(401).json({ error: "ไม่มี token การเข้าถึง" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "การเข้าถึง token ไม่ถูกต้อง" });
    }

    req.user = user.id;
    next();
  });
};

router.post("/", verifyJWT, async (req, res) => {
  try {
    const { name, des, status, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    console.log(req.user);
    const newProject = new Project({
      name,
      des: des || "",
      status: status || "Open",
      startDate: startDate || null,
      endDate: endDate || null,
      user: [req.user],
    });

    const saved = await newProject.save();
    console.log("saved", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/", verifyJWT, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user });
    res.json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId).populate(
      "user",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:projectId/issues", verifyJWT, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !priority || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newIssue = new Issue({
      title,
      description: description || "",
      status: status || "Open",
      priority,
      dueDate,
      projectId,
    });

    const saved = await newIssue.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:projectId/issues", async (req, res) => {
  const { projectId } = req.params;

  try {
    const issues = await Issue.find({ projectId });
    res.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:projectId", verifyJWT, async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (!project.user.includes(req.user)) {
      return res
        .status(403)
        .json({ message: "You are not the project owner." });
    }

    await Project.findByIdAndDelete(projectId);

    await Issue.deleteMany({ projectId });

    res.json({ message: "Project and related issues deleted successfully." });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
