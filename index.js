const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT;

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket){
    socket.on("send-location", function (data){ // Received Data i.e Latitude and Longitute from Frontend.
        io.emit("receive-location", {id : socket.id, ...data}); // Send back to the Frontend.
    })
    
    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function(req , res){
    res.render("index");
});

server.listen(PORT);