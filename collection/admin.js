const mongoose = require('mongoose');

const AdminCollection = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const model = mongoose.model('Admins', AdminCollection);

module.exports = model;