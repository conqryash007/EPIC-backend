const UserSelection = require("./../models/UserSelection");
const Topic = require("./../models/Topics");

const checkQuizValidity = async (req, res, next) => {
  try {
    const userSelection = await UserSelection.findById(req.params.userId);
    if (!userSelection) {
      return res.status(404).json({ message: "UserSelection not found" });
    }

    const topic = await Topic.findById(userSelection.topic_id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const durationWeeks = topic.duration_weeks;
    if (!durationWeeks || isNaN(durationWeeks)) {
      return res.status(400).json({ message: "Invalid course duration" });
    }

    const currentDate = new Date();
    const updatedAt = new Date(userSelection.updatedAt);

    const timeDifference = currentDate - updatedAt;

    const millisecondsInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksPassed = timeDifference / millisecondsInWeek;

    if (weeksPassed > durationWeeks) {
      return res.status(403).json({ message: "Quiz Over" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = checkQuizValidity;
