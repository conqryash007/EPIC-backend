const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// routes imports
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const childRoute = require("./routes/child-route");
const quizRoute = require("./routes/quiz-route");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

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
app.use("/api/quiz", quizRoute);

const School = require("./models/School");
app.get("/api/options", async (req, res) => {
  try {
    const schools = await School.find();

    data = schools.map((curr) => {
      return { label: curr.school_name, value: curr._id };
    });

    res.status(200).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
});
app.get("/api/all/:coll", async (req, res) => {
  let { coll } = req.params;

  coll += `.js`;

  try {
    // Dynamically import the model module
    const modelModule = await import(`./models/${coll}`);
    const CollectionModel = modelModule.default;

    if (!CollectionModel) {
      return res.status(400).send(`Collection ${collection} not found`);
    }

    const docs = await CollectionModel.find();
    res.status(200).json({ ok: true, data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding data to collection");
  }
});
app.post("/api/add", async (req, res) => {
  const { collection, data } = req.body;

  try {
    const modelModule = await import(`./models/${collection}`);
    const CollectionModel = modelModule.default;

    if (!CollectionModel) {
      return res.status(400).send(`Collection ${collection} not found`);
    }

    const doc = new CollectionModel(data);
    await doc.save();
    res.send(`Data added to ${collection} collection`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding data to collection");
  }
});

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjfrm.mongodb.net/epic-test?retryWrites=true&w=majority&appName=Cluster0`
//   )

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hjfrm.mongodb.net/epic-test?retryWrites=true&w=majority&appName=Cluster0`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(3000);
    console.log("Server started successfully👍 ", 3000);
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));
