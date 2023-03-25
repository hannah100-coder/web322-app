const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('sdneupbp', 'sdneupbp', 'xFPhz2PpSciN0pUZPLrYrsbsudxEiFcs', {
    host: 'mahmud.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define a "Post" model
var Post = sequelize.define('Post', {
    post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "post_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

// Define a "Category" model
var Category = sequelize.define('Category', {
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // use "post_id" as a primary key
        autoIncrement: true // automatically increment the value
    },
    category: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

Post.belongsTo(Category, {foreignKey: 'category'});


exports.initialize = function() {
    return new Promise((resolve, reject) => {

        let data = sequelize.sync()
        if(data) {
            resolve("success!")
        }else {
            reject("unable to sync the database")
        }
});
}


exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {

        let data = Post.findAll()
        if(data) {
            resolve(data);
        }else {
            reject("no results returned");
        }
});

}


exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        let data = Post.findAll({
            where: {
                published: true
            }
        });

        if(data) {
            resolve(data);
        }else {
            reject("no results returned");
        }
});

}

exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        let data = Category.findAll();
        if(data) {
            resolve(data);
        }else{
            reject("no results returned");
        }
});

}

exports.addPost = function(postData) {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        postData.postDate = new Date();
        for(var property in postData) {
            if(!postData[property]) {
                postData[property] = null;
            }
        }

        console.log(postData)
        let newPost = Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published
        })
        
        if(newPost){
            resolve("success");
        }else{
            reject("unable to create post");
        }
});

}

exports.getPostsByCategory = function(value) {
    return new Promise((resolve, reject) => {

        let data = Post.findAll({
            where: {
                category: value
            }
        });

        if(data) {
            resolve(data);
        }else {
            reject("no results returned");
        }
});

}

exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        let data = Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        });

        if(data) {
            resolve(data);
        }else {
            reject("no results returned");
        }
});

}

exports.getPostById = function(id) {
    return new Promise((resolve, reject) => {
        let data = Post.findAll({
            where: {
                id: id
            }
        });

        if(data) {
            resolve(data);
        }else {
            reject("no results returned");
        }
    });
}

exports.getPublishedPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        reject();
    });
}

exports.addCategory = function(categoryData) {
    return new Promise((resolve, reject) => {
        for(var property in categoryData) {
            if(!categoryData[property]) {
                categoryData[property] = null;
            }
        }

        let newCategory = Category.create({
            category: categoryData.category,
        })
        
        if(newCategory){
            resolve("success");
        }else{
            reject("unable to create category");
        }
    });
}

exports.deleteCategoryById = function(id) {
    return new Promise((resolve, reject) => {

        let destroyCategory = Category.destroy({
            where: {    id: id  }
        })

        if(destroyCategory === err) {
            reject("was rejected");
        }else {
            resolve("success");
        }
    })
}

exports.deletePostById = function(id) {
    return new Promise((resolve, reject) => {

        let destroyPost = Post.destroy({
            where: {    id: id  }
        })

        if(destroyPost === err){
            reject("was rejected");
        }else{
            resolve("success");
        }
    })
}