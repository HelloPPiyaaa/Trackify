const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  des: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Open", "InProgress", "Done"],
    default: "Open",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
