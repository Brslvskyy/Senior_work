const mongoose = require("mongoose");

const EventCollection = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const model = mongoose.model("Events", EventCollection);

module.exports = model;
