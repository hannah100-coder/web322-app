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
        console.log('in promise')

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
        posts.push(postData);
        
        resolve(postData);
    })
}