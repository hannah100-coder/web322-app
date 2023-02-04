const { json } = require("express");
const fs = require("fs"); 
const { resolve } = require("path");
var path = require("path")

let filepath_posts = path.join(__dirname, '/data/posts.json');
let filepath_categories = path.join(__dirname, '/data/categories.json');
let posts;
let categories;


exports.initialize = function() {
    return new Promise((resolve, reject) => {
        console.log('in promise')

        let r_posts = fs.readFileSync(filepath_posts)
            // .then((data) => {
            //     posts = JSON.parse(data)
            // })
            // .catch((err) => {
            //     throw err;
            // })

        posts = JSON.parse(r_posts)

        let r_categories = fs.readFileSync(filepath_categories)
        categories = JSON.parse(r_categories)
            // .then((data) => {
            //     categories = JSON.parse(data)
            // })
            // .catch((err) => {
            //     throw err;
            // })
        // function stringPosts(){
        //     return new Promise((resolve, reject) => {
        //         fs.readFile(filepath_posts, 'utf-8', (err, data) => {
        //             if(err) throw err;
        //     })
        // })}

        // console.log(stringPosts)
        // let s_posts = stringPosts()
        //     .then((s_posts) => {
        //         console.log('in then: ', s_posts)
        //         posts = JSON.parse(s_posts);
        //         return posts;
        //     })

//then 이 아닌 것 같음. resoleve도 아닌 것 같구,,, 흠
        // function stringCategories() {
        //     return new Promise((resolve, reject) => {
        //     fs.readFile(filepath_categories, 'utf-8', (err, data) => {
        //         if(err) throw err;
        //     })
        // })};

        // let s_categories = stringCategories()
        //     .then((s_categories) => {
        //         categories = JSON.parse(s_categories);
        //         return categories;
        //     })

       
    
        //console.log(posts)
        //console.log(categories)

        // categories = JSON.parse(fs.readFile('categories.json', 'utf8', (err, data) => {
        //     if (err) throw err;
        //     console.log(data);
        // }));

        if(!posts && !categories) {
            reject('unable to read file');
        }else {
            resolve(posts, categories)
        }

        // if(posts.length > 0 && categories.length > 0) {
        //     resolve(posts, categories)
        // } else {
        //     reject('unable to read file')
        // }

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