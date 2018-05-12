var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const SERVER_PORT = 8080;

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

// making vars as models of the post and comments.
var SpaceBookModels = require('./models/postModel');
var PostModel = SpaceBookModels.Post;
var CommentModel = SpaceBookModels.CommentModel;

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/posts', function (req, res) {

  let freshPost = new PostModel(req.body)
  freshPost.save(function (err, newPostfromDB) {
    if (err) {
      console.log(err)
    } else {
      res.send(newPostfromDB)
    }
  })
});

app.post('/postforcomment/:id', function (req, res) {
  let freshComment = new CommentModel(req.body)
  PostModel.findOneAndUpdate(
    { _id: req.params.id }, { $push: { comments: freshComment } }, function (err, updatedPost) {
      res.send(updatedPost)
    })

});

app.get('/posts', function (req, res) {
  PostModel.find().exec(function (err, foundPosts) {
    if (err) {
      console.log(err)
    } else {
      res.send(foundPosts)
    }
  })
});

app.delete('/posts/:id', function (req, res) {
  PostModel.findByIdAndRemove({ _id: req.params.id }, function (err, deletedPost) {
    PostModel.find().exec(function (err, foundPosts) {
      if (err) {
        console.log(err)
      } else {
        res.send(foundPosts)
      }
    })
  })

})

app.delete('/deleteComment/:postId/:commentId', function (req, res) {
  PostModel.findByIdAndUpdate({ _id: req.params.postId }, { $pull: { comments: { _id: req.params.commentId } } }, function (err, updatedpost) {
    PostModel.find({ _id: req.params.postId }).exec( function (err, postWithoutComment) {
      if (err) {
        console.log(err)
      } else {
        res.send(postWithoutComment)
      }
    })

  })

})













app.listen(SERVER_PORT, () => {
  console.log("Server started on port " + SERVER_PORT);
});
