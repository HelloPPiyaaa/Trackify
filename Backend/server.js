const express = require("express");
const mongoose = require("mongoose");
const core = require("cors");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("MongoDB Connected!");
  } catch (err) {
    console.log(err.message);
  }
};

const app = express();
connectDB();

app.use(core());
app.use(express.json());

//Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/issues", require("./routes/issues"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
