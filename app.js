//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose =  require("mongoose");
const encrypt = require("mongoose-encryption")
const md5 = require("md5")
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});  

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});
const secret = "Thisisourlittlesecret.";
//userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});
const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            // password: md5(req.body.password)
            password: hash
         })
         newUser.save().then(()=>{
            res.render("secrets");
         }).catch((err)=>{
            console.log(err);
         })
    });
    
})

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}).then(foundUser=>{
        if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result){
                        res.render("secrets");
                    }
                });
                console.log(foundUser.password)
        }
    })
    .catch(err=>{
        console.log(err);
    });
});

app.listen(3000,function(){
    console.log("server is running on port 3000");
})




