const { json } = require("express");
const fs = require("fs"); 
const { resolve } = require("path");
var path = require("path")

let filepath_posts = path.join(__dirname, '/data/posts.json');
let filepath_categories = path.join(__dirname, '/data/categories.json');
let posts;
let categories;
let postData;


exports.initialize = function() {
    return new Promise((resolve, reject) => {

        let r_posts = fs.readFileSync(filepath_posts)
            
        posts = JSON.parse(r_posts)

        let r_categories = fs.readFileSync(filepath_categories)
        categories = JSON.parse(r_categories)
        

        if(!posts && !categories) {
            reject('unable to read file');
        }else {
            resolve(posts, categories)
        }

    })}


exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        if(posts.length > 0) {
            resolve(posts);
        }else{
            reject('no results returned');
        }
    })
}


exports.getPublishedPosts = function() {
    return new Promise ((resolve, reject) => {
        let publishedPosts = [];
        posts.forEach((post) => {
            if(post.published === true) {
                publishedPosts.push(post);
            }
        })

        if(publishedPosts.length > 0) {
            resolve(publishedPosts);
        } else {
            reject ('no results returned');
        }
    })
}

exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        if(categories.length > 0) {
            resolve(categories);
        }else{
            reject('no results returned');
        }
    })
}

exports.addPost = function(postData) {
    return new Promise((resolve, reject) => {
        if(postData.published === undefined){
            postData.published = false;
        }else{
            postData.published = true;
        }
        postData.id = posts.length + 1;
        postData.postDate = new Date();
        posts.push(postData);
        
        resolve(postData);
    })
}

exports.getPostsByCategory = function(value) {
    return new Promise ((resolve, reject) => {
        let c_posts = [];

        posts.forEach((post) => {
            if(post.category === value) {
                c_posts.push(post);
            }
        })
        if(c_posts.length > 0) {
            resolve(c_posts);
        } else {
            reject('no results returned');
        }
    })
}

exports.getPostsByMinDate = function(minDateStr) {
    return new Promise ((resolve, reject) => {
        let m_posts = [];
        posts.forEach((post) => {
            let minDate = new Date(minDateStr);
            let postDate = new Date(post.postDate);
            if(minDate.getTime() <= postDate.getTime()){
                m_posts.push(post);
            }
        })
        if(m_posts.length > 0){
            resolve(m_posts);
        }else {
            reject('no results returned');
        }
    })
}

exports.getPostById = function(id) {
    return new Promise ((resolve, reject) => {
        let result;
        posts.forEach((post) => {
            if(Number(id) === post.id) {
                result = post;
            }
        })
    if(result){
        resolve(result);
    }else {
        reject('no results returned');
    } 
    })
}

exports.getPublishedPostsByCategory = function(category) {
    return new Promise ((resolve, reject) => {
        let publishedPosts = [];
        posts.forEach((post) => {
            if(post.published === true && post.category == category) {
                publishedPosts.push(post);
            }
        })

        if(publishedPosts.length > 0) {
            resolve(publishedPosts);
        } else {
            reject ('no results returned');
        }
    })
}