var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

let commentSchema = new mongoose.Schema({

});


let postSchema = new mongoose.Schema({

});

let Post = mongoose.model('post', postSchema)

module.exports = Post
