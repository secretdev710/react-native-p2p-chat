const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String
});

module.exports = mongoose.model("User", userSchema)