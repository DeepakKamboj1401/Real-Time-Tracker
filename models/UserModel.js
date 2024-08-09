const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://deepakkambojprog:mpl0PWF4V6BH3lEK@backenddb.dqc9e.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB");

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String
});

module.exports = mongoose.model("user" , userSchema);