const mongoose = require("mongoose");

const TicketCollection = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const model = mongoose.model("Ticket", TicketCollection);

module.exports = model;
