const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/users.routes");
const { courseRoute } = require("./routes/courses.route");
const { videoRoute } = require("./routes/videos.route");

const cors = require('cors');
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8080; // Use Render's PORT or default to 8080

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/courses", courseRoute);
app.use("/videos", videoRoute);

app.get("/regenerateToken", (req, res) => {
  const rToken = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(rToken, "ARIVU");
    const token = jwt.sign(
      { userId: decoded.userId, user: decoded.user },
      "arivu",
      { expiresIn: "7d" }
    );
    res.status(201).json({ msg: "token created", token });
  } catch (err) {
    res.status(400).json({ msg: "not a valid Refresh Token" });
  }
});

app.get('/', (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to SRM's Backend" });
  } catch (err) {
    res.status(400).json({ message: "Some Error Occurred. Please Refresh" });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Connected to db`);
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(`Database connection error: ${error}`);
  }
});

