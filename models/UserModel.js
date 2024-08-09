const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://deepakkamboj:xkq32kDuQiHAeQ4D@realtimetracker.srs14d1.mongodb.net/?retryWrites=true&w=majority&appName=RealTimeTracker");

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String
});

module.exports = mongoose.model("user" , userSchema);