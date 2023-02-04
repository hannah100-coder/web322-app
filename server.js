//var blog_service = require('blog-service.js');
//import posts from '/data/posts.json';

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