var express = require("express");
var app = express();
var path = require("path");
const {
  getPublishedPosts,
  initialize,
  getCategories,
  getAllPosts,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById
} = require("./blog-service");
app.use(express.static("public"));

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


cloudinary.config({
  cloud_name: 'dy3q249qx',
  api_key: '615917821529986',
  api_secret: 'nB-5ecweXuAuuG7OEl37HJCLsuw',
  secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage



var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", function (req, res) {
  getPublishedPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(`{message: ${err}}`);
    });
});

app.get("/posts", function (req, res) {
  let category = req.query.category;
  let minDate = req.query.mindate;
  console.log('category: ', category);
  console.log('mindate: ', minDate)
  if(category) {
    getPostsByCategory(Number(category))
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(`{message: ${err}}`);
      })
  }else if(minDate) {
    getPostsByMinDate(minDate)
      .then((data) => {
        res.send(data);
    })
      .catch((err) => {
        res.send(`{message: ${err}}`);
    })
  }else {
    getAllPosts()
      .then((data) => {
        res.send(data);
    })
      .catch((err) => {
        res.send(`{message: ${err}}`);
    });
  }
});

app.get("/post/:id", function(req,res) {
  let id = req.params.id;
  getPostById(id)
    .then((data) => {
      res.send(data);
  })
    .catch((err) => {
      res.send(`{message: ${err}}`);
  });

})

app.get("/categories", function (req, res) {
  getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(`{message: ${err}}`);
    });
});

app.get("/posts/add", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

app.post("/posts/add", function (req, res) {
  console.log('post request')
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req).then((uploaded) => {
    req.body.featureImage = uploaded.url;

    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    addPost(postData);
  });

  res.redirect("/posts")
});

initialize()
  .then(() => app.listen(HTTP_PORT, onHttpStart))
  .catch((err) => console.error(err));
