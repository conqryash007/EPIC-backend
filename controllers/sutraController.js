const getCurrentWeekAndDay = (startDate) => {
  const currentDate = new Date();
  const start = new Date(startDate);

  const timeDifference = currentDate - start;
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(daysPassed / 7) + 1;

  const currentDay = (daysPassed % 7) + 1;

  return {
    week: currentWeek,
    day: currentDay,
  };
};

// Example Usage:
const startDate = "2024-09-01"; // Starting on 1st September 2024
const result = getCurrentWeekAndDay(startDate);
console.log(`We are currently in Week ${result.week}, Day ${result.day}`);

exports.getSutraForUser = async (req, res) => {
  try {
  } catch (err) {}
};
