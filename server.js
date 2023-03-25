/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: __Hannah Baek___ Student ID: 153755228 Date: Mar 24, 2023
*
*  Online (Cyclic) Link: https://plum-sore-catfish.cyclic.app
********************************************************************************/ 


var express = require("express");
var app = express();
var path = require("path");
// const {
//   getPublishedPosts,
//   initialize,
//   getCategories,
//   getAllPosts,
//   getPostsByCategory,
//   getPostsByMinDate,
//   getPostById,
//   addPost,
// } = require("./blog-service");
const blogData = require("./blog-service");
app.use(express.static("public"));

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const upload = multer(); // no { storage: storage } since we are not using disk storage

cloudinary.config({
  cloud_name: 'dy3q249qx',
  api_key: '615917821529986',
  api_secret: 'nB-5ecweXuAuuG7OEl37HJCLsuw',
  secure: true
});

const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

const stripJs = require('strip-js');

app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    navLink: function(url, options){
      return '<li' + 
          ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
          '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    },
    safeHTML: function(context){
      return stripJs(context);
    },
    formatDate: function(dateObj){
      let year = dateObj.getFullYear().toString();
      let month = (dateObj.getMonth() + 1).toString();
      let day = dateObj.getDate().toString();
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
  }
  }
}));

app.use(express.urlencoded({extended: true}));


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.redirect("/blog");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render('about')
});

app.get("/blog", async function (req, res) {
  // getPublishedPosts()
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.send(`{message: ${err}}`);
  //   });

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogData.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogData.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // get the latest post from the front of the list (element 0)
      let post = posts[0]; 

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});

app.get("/posts", function (req, res) {
  let category = req.query.category;
  let minDate = req.query.mindate;
  if(category) {
    blogData.getPostsByCategory(Number(category))
      .then((data) => {
        //res.send(data);
        if(data.length > 0){
          res.render("posts", {posts: data})
        }else{
          res.render("posts", {message: "no results"});
        }
      })
      .catch((err) => {
        //res.send(`{message: ${err}}`);
        res.render("posts", {message: "no results"});
      })
  }else if(minDate) {
    blogData.getPostsByMinDate(minDate)
      .then((data) => {
        //res.send(data);
        if(data.length > 0){
          res.render("posts", {posts: data})
        }else{
          res.render("posts", {message: "no results"});
        }
    })
      .catch((err) => {
        //res.send(`{message: ${err}}`);
        res.render("posts", {message: "no results"});
    })
  }else {
    blogData.getAllPosts()
      .then((data) => {
        //res.send(data);
        if(data.length > 0){
          res.render("posts", {posts: data})
        }else{
          res.render("posts", {message: "no results"});
        }
    })
      .catch((err) => {
        //res.send(`{message: ${err}}`);
        res.render("posts", {message: "no results"});
    });
  }
});

app.get("/post/:id", function(req,res) {
  let id = req.params.id;
  blogData.getPostById(id)
    .then((data) => {
      res.send(data);
  })
    .catch((err) => {
      res.send(`{message: ${err}}`);
  });

})

app.get("/categories", function (req, res) {
  blogData.getCategories()
    .then((data) => {
      if(data.length > 0){
        res.render("categories", {categories: data});
      }else{
        res.render("categories", {message: "no results"});
      }
    })
    .catch((err) => {
      res.render("categories", {message: "no results"});
    });
});

app.get("/posts/add", function (req, res) {
  //res.sendFile(path.join(__dirname, "/views/addPost.html"));
  res.render('addPost');
});


app.post("/posts/add", upload.single("featureImage"), (req,res)=>{

  if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
  
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }
  
      upload(req).then((uploaded)=>{
          processPost(uploaded.url);
      });
  }else{
      processPost("");
  }

  function processPost(imageUrl){
      req.body.featureImage = imageUrl;

      blogData.addPost(req.body).then(post=>{
          res.redirect("/posts");
      }).catch(err=>{
          res.status(500).send(err);
      })
  }   
});

app.get('/blog/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogData.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogData.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the post by "id"
      viewData.post = await blogData.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});


app.get('/categories/add',(req, res) => {
    res.render('addCategory');
})

app.post('/categories/add', (req,res) => {
  blogData.addCategory(req.body).then(category=>{
      res.redirect("/categories");
  }).catch(err=>{
      res.status(500).send(err);
  })
})

app.get('/categories/delete/:id', (req, res) => {
  let id = req.params.id;
  blogData.deleteCategoryById(id)
    .then(() => {
      redirect('/categories')
    }).catch(err => {
      res.status(500).send('Unable to Remove Category / Category not found');
    })
})

app.get('/posts/delete/:id', (req, res) => {
  let id = req.params.id;
  blogData.deletePostById(id)
    .then(() => {
      redirect('/posts')
    }).catch(err => {
      res.status(500).send('Unable to Remove Post / Post not found');
    })
})


blogData.initialize()
  .then(() => app.listen(HTTP_PORT, onHttpStart))
  .catch((err) => console.error(err));
