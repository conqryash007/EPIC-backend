const Topic = require("../models/QUIZ/Topic");
const UserSeletion = require("./../models/UserSelection");

// ---------------------------------------
// ------------TOPIC----------------------
// Create a new topic
exports.createTopic = async (req, res) => {
  try {
    const body = { created_by: req.user.id, ...req.body };

    const topic = new Topic(body);
    await topic.save();

    res.status(201).json({ ok: true, data: topic });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
// Get all topics
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    const books = topics.filter((item) => item.topic_type === "Book");
    const courses = topics.filter((item) => item.topic_type === "Course");

    res
      .status(200)
      .json({ ok: true, data: { books: books, courses: courses } });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

exports.saveUserselectionTopic = async (req, res) => {
  try {
    const userId = req.user.id;

    const xx = await UserSeletion.find({ userId });

    if (xx.length > 0) {
      const data = await UserSeletion.findOneAndUpdate(
        { userId },
        { ...req.body },
        { new: true }
      );

      res
        .status(201)
        .json({ ok: true, data, msg: "Updated User Selction details" });
    } else {
      const userTopic = new UserSeletion({ userId, ...req.body });
      const data = await userTopic.save();

      res.status(201).json({ ok: true, data });
    }
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Get a topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(200).json({ ok: false, msg: "Topic not found" });
    }
    res.status(200).json({ ok: true, data: topic });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
// Update a topic
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!topic) {
      return res.status(200).json({ ok: false, msg: "Topic not found" });
    }
    res.status(200).json({ ok: true, data: topic });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
// Update a topic
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await User.findOneAndDelete(req.param.id);
    if (!topic) {
      return res.status(200).json({ message: "Topic not found" });
    }

    res.status(200).json({ ok: true, msg: "Topic deleted" });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
