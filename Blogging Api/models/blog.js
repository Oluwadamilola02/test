const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  state: String,
  read_count: Number,
});

module.exports = mongoose.model("Blog", blogSchema);
