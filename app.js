const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const app = express();

const User = require(`./models/UserModel`);

const http = require("http");

const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT;

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

io.on("connection", function(socket){
    socket.on("send-location", function (data){ // Received Data i.e Latitude and Longitute from Frontend.
        io.emit("receive-location", {id : socket.id, ...data}); // Send back to the Frontend.
    })
    
    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/Map", function(Request , Response){
    Response.render("index");
});

app.get("/" , (Request , Response) => {
    Response.render("SignIn.ejs");
});

app.get("/SignUp" , (Request , Response) => {
    Response.render("SignUp.ejs");
});

app.post("/SignIn" , async (Request , Response) => {
    let {Email , Password} = Request.body;

    let user = await User.findOne({email : Email});

    if(user){
        bcrypt.compare(Password , user.password , (Error , result) => {
            if(result){
                JWT.sign({email : Email}, "shhhhhhh", {expiresIn : "1h"}, (Error , Token) => {
                    Response.cookie("Token" , Token);
    
                    Response.redirect("/Map");
                })
            }
            else Response.redirect("/");
        })
    }
    else Response.redirect("/");
});

app.post("/CreateAccount" , (Request , Response) => {
    bcrypt.genSalt(10 , (Error , salt) => {

        bcrypt.hash(Request.body.Password, salt, async (Error , hash) => {

            let {Name, Email, password} = Request.body;

            let CreatedUser = await User.create({
                name : Name,
                email : Email,
                password : hash
            })

            JWT.sign({email : Email}, "shhhhhhh", {expiresIn : "1h"}, (Error , Token) => {
                Response.cookie("Token" , Token);

                Response.redirect("/Map");
            })
        })
    })
})

server.listen(PORT || '3000');