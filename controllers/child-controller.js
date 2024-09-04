const Child = require("../models/Child");

// Get a child by ID
exports.getChildById = async (req, res) => {
  try {
    const userId = req.user.id;
    const child = await Child.find({ userId });
    if (!child.length) {
      return res
        .status(200)
        .json({ ok: false, data: [], msg: "Child not found" });
    }
    const data = child.map((item) => {
      return { label: item.name, value: item._id };
    });

    res.status(200).json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Get all children by user id
exports.getChildrenByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const child = await Child.find({ userId });
    if (child.length < 1) {
      return res.status(200).json({ ok: false, msg: "Children not found" });
    }
    res.status(200).json({ ok: true, data: child });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Create new children
exports.createChildren = async (req, res) => {
  try {
    const userId = req.user.id;
    const childrenData = req.body.childern.map((child) => ({
      userId,
      ...child,
    }));

    const children = await Promise.all(
      childrenData.map((childData) => new Child(childData).save())
    );

    res.status(201).json({ ok: true, data: children });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

// Update a child
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!child) {
      return res.status(200).json({ ok: false, msg: "Child not found" });
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
      return res.status(200).json({ ok: false, msg: "Child not found" });
    }
    res.status(200).json({ ok: true, msg: "Child deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
