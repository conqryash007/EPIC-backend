const Topic = require("../models/QUIZ/Topic");

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
    const books = topics.filter(item => item.topic_type === 'Book');
    const courses = topics.filter(item => item.topic_type === 'Course');

    res.status(200).json({ ok: true, data: {'books':books, 'courses':courses} });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Get a topic by ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ ok: false, msg: "Topic not found" });
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
      runValidators: true,
    });
    if (!topic) {
      return res.status(404).json({ ok: false, msg: "Topic not found" });
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
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ ok: true, msg: "Topic deleted" });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
