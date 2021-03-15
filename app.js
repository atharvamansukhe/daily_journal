
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const exp = require(__dirname + "/export.js")
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

 mongoose.connect("mongodb://localhost:27017/journalDB", {useNewUrlParser: true, useUnifiedTopology: true});

const journalSchema = new mongoose.Schema({
  title: String,
  content: String,
  short: String
});

const Post = mongoose.model("Post", journalSchema);


app.get("/", (req,res)=> {
const home = exp.homeStartingContent;

Post.find({}, (err,posts)=>{
  res.render("home", {homeText: home, newPosts: posts });
});

});

app.get("/about", (req,res)=> {
const about = exp.aboutContent;
res.render("about", {homeText: about});
});

app.get("/contact", (req,res)=> {
const cont = exp.contactContent;
res.render("contact", {homeText: cont});
});

app.get("/posts/:postId", (req,res)=> {
const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, (err, post)=>{
    if(!err){
      res.render("post", {title: post.title, content: post.content});
    }
     else {
       res.redirect("/");
     }
  });
});


app.get("/compose", (req,res)=> {
res.render("compose", {});
});

app.post("/compose", (req,res)=> {

const post = new Post ({
  title: req.body.composeTitle ,
  content: req.body.composePost,
  short: _.kebabCase(req.body.composeTitle)
});
post.save((err)=>{
  if(!err){
    res.redirect("/");
  }
});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
