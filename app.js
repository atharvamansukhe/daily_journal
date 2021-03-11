
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const exp = require(__dirname + "/export.js")
const _ = require('lodash');

const app = express();

let posts = [];

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res)=> {
const home = exp.homeStartingContent;
res.render("home", {homeText: home, newPosts: posts });
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
const requestedTitle = _.lowerCase(req.params.postId);

posts.forEach(post => {
  const storedTitle =_.lowerCase([post.title]);
  if(requestedTitle === storedTitle) {
    console.log("match");
    res.render("post", {title: post.title, content: post.content})
   }
});
});

app.get("/compose", (req,res)=> {
res.render("compose", {});
});

app.post("/compose", (req,res)=> {
  const post = {
    title:req.body.composeTitle ,
    content:req.body.composePost,
    short:_.kebabCase(req.body.composeTitle)
  };
posts.push(post);
res.redirect("/");
});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
