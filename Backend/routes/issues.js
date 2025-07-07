const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");

router.put("/:issueId", async (req, res) => {
  const { issueId } = req.params;
  const { status } = req.body;

  if (!["Open", "InProgress", "Done"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updated = await Issue.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:issueId", async (req, res) => {
  const { issueId } = req.params;

  try {
    const deleted = await Issue.findByIdAndDelete(issueId);

    if (!deleted) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully." });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
