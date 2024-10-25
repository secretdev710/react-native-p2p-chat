import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema)