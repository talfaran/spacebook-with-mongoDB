var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


var commentSchema = new mongoose.Schema({
    text: String,
    user: String
  });
  
  
  var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema]
  });

let Post = mongoose.model('post', postSchema);
let CommentModel = mongoose.model('comment', commentSchema);


module.exports = {CommentModel: CommentModel, Post: Post}

