const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// routes imports
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const childRoute = require("./routes/child-route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// routes
app.use("/api/health", (req, res) => {
  try {
    res.status(200).json({ ok: true, health: "100%" });
  } catch (err) {
    res.status(200).json({ ok: false, msg: "Server Down!" });
  }
});
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/child", childRoute);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjfrm.mongodb.net/epic-test?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("Server started successfully👍 ", process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err.message);
  });
