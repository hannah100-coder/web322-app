/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ____Hannah Baek_________ Student ID: _15375528____ Date: __Feb 03, 2023____
*
*  Online (Cyclic) Link: https://plum-sore-catfish.cyclic.app
*
********************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
const { getPublishedPosts, initialize, getCategories, getAllPosts } = require("./blog-service");
app.use(express.static('public'));


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect('/about')
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", function(req, res){
  getPublishedPosts()
    .then((data) => { res.send(data) })
    .catch((err) => { res.send(`{message: ${err}}`) })
})

app.get("/posts", function(req, res) {
  getAllPosts()
    .then((data) => { res.send(data) })
    .catch((err) => { res.send(`{message: ${err}}`) })
})

app.get("/categories", function(req, res){
  getCategories()
    .then((data) => { res.send(data) })
    .catch((err) => { res.send(`{message: ${err}}`) })
})


initialize()
  .then(() => app.listen(HTTP_PORT, onHttpStart))
  .catch((err) => console.error(err))