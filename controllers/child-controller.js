const Child = require("../models/Child");

// Get a child by ID
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ ok: false, msg: "Child not found" });
    }
    res.status(200).json({ ok: true, data: child });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Get all children by user id
exports.getChildrenByUserId = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ ok: false, msg: "Child not found" });
    }
    res.status(200).json({ ok: true, data: child });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Create a new child
exports.createChild = async (req, res) => {
  try {
    const userId = req.user.uid;
    const childData = { userId, ...req.body };

    const child = new Child(childData);
    await child.save();

    res.status(201).json({ ok: true, data: child });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Update a child
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!child) {
      return res.status(404).json({ ok: false, msg: "Child not found" });
    }
    res.status(200).json({ ok: true, data: child });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Delete a child
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) {
      return res.status(404).json({ ok: false, msg: "Child not found" });
    }
    res.status(200).json({ ok: true, msg: "Child deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
