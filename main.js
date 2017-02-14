<<<<<<< HEAD
var SpacebookApp = function() {

    var posts = {}
    var currentId = 0;
    var $posts = $(".posts");

    var POST_STORE = 'spacebook_posts';

    function _getFromLocalStorage() {
        posts = JSON.parse(localStorage.getItem(POST_STORE) || '{ "posts": [], "currentId": 0 }');
        //console.log(posts);
    }

    function _saveToLocalStorage() {
        localStorage.setItem(POST_STORE, JSON.stringify(posts));
    }

    _getFromLocalStorage();
    _renderPosts();

    var post = function(btn) {

        var input = $(btn).closest("form").find("input");
        var post = input.val();
        if (post === "") {
            alert("Please enter text!");
        } else {
            _addPost(post);
            input.val("");
            _renderPosts();
        }
    };

    function _renderPosts() {

        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);

        posts.posts.forEach(function(post) {
            var newHTML = template(post);
            // append our new html to the page
            $posts.append(newHTML);
        });
    }

    function _addPost(newPost) {
        posts.posts.push({ text: newPost, id: posts.currentId, comments: [] });
        posts.currentId++;
        _saveToLocalStorage();

    }

    function _renderSinglePost($commentsList, postIndex) {
        //this function re-renders the post so that the comment count can updates
        $post = $commentsList.closest('.post');
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(posts.posts[postIndex]);
        //clear the old post
        $post.empty();
        //append the replacement post leaving the old div.post wrapper in place
        $post.append(newHTML);
        //to delete the old wrapper, step down a level and remove the parent 
        $replacementPost = $post.children();
        $replacementPost.unwrap();
        //we deleted the old $commentsList so we need to return the new list
        return $replacementPost.find('.comments-list');
    }

    function _renderComments($commentsList, postIndex) {
        //first to update the commentCount we need to rerender the whole post, yuck!
        $commentsList = _renderSinglePost($commentsList, postIndex);
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        posts.posts[postIndex].comments.forEach(function(comment) {
            var newHTML = template(comment);
            // append our new html to the page
            $commentsList.append(newHTML);
        });
        return $commentsList;
    }

    var removePost = function(btn) {

        //use jQuery to get id
        var id = $(btn).closest(".post").data().id;
        //remove post from array
        posts.posts = posts.posts.filter(function(post) {
            return post.id != id;
        });
        _renderPosts();
        _saveToLocalStorage();

    };

    var addComment = function(btn) {

        var $comment = $(btn).siblings('.comment');
        var $user = $(btn).siblings('.name');

        if ($comment.val() === "" || $user.val() === "") {
            alert("Please enter your name and a comment!");
            return;
        }

        // finding the index of the post in the page... we will use it in #createComment
        var postIndex = $(btn).closest('.post').index();
        var $commentsList = $(btn).closest('.post').find('.comments-list');
        var newComment = { text: $comment.val(), user: $user.val() };

        posts.posts[postIndex].comments.push(newComment);

        $comment.val("");
        $user.val("");

        $commentsList = _renderComments($commentsList, postIndex);
        $commentsList.addClass('show');

        _saveToLocalStorage();

    };

    var toggleComments = function(btn) {
        var $commentsList = $(btn).closest('.post').find('.comments-list');
        //render comments if list is hidden and there are no comments in the list!
        if (!$commentsList.hasClass('show') && $commentsList.children().length === 0) {
            var postIndex = $(btn).closest('.post').index();
            $commentsList = _renderComments($commentsList, postIndex);
        }
        $commentsList.toggleClass('show');
    };

    var deleteComment = function(btn) {
        var $commentsList = $(btn).closest('.post').find('.comments-list');
        var postIndex = $(btn).closest('.post').index();
        var commentIndex = $(btn).closest('.comment').index();

        //remove the comment and refresh the view
        posts.posts[postIndex].comments.splice(commentIndex, 1);
        $commentsList = _renderComments($commentsList, postIndex);
        //finally show the list minus the comment that was removed
        $commentsList.addClass('show');
        _saveToLocalStorage();

    };

    return {
        post: post,
        removePost: removePost,
        addComment: addComment,
        deleteComment: deleteComment,
        toggleComments: toggleComments
    };
};

var app = SpacebookApp();
//click handler for post
var post = app.post;
var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
    app.removePost(this);
});

$posts.on('click', '.add-comment', function() {
    app.addComment(this);
});

$posts.on('click', '.remove-comment', function() {
    app.deleteComment(this);
});

$posts.on('click', '.toggle-comments', function() {
    app.toggleComments(this);
});
=======
var SpacebookApp = function () {
  // dummy data
  var posts = [
    {text: "Hello world 1", comments:[
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"}
    ]},
    {text: "Hello world 2", comments:[
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"}
    ]},
    {text: "Hello world 3", comments:[
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"},
      { text: "Man, this is a comment!"}
    ]}
  ];

  // variable for storing our posts div
  var $posts = $('.posts');

  // build a single post object and push it to array
  var createPost = function (text) {
    posts.push({ text: text, comments: []});
  };

  // Empty all the posts, then add them from the posts array along with our
  // new comments HTML
  var renderPosts = function () {
    $posts.empty();

    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];

      var commentsContainer = '<div class="comments-container">' + '<div class=comments-list></div>' +
      '<input type="text" class="comment-name">' +
      '<button class="btn btn-primary add-comment">Post Comment</button> </div>';

      $posts.append('<div class="post">'
        + '<a href="#" class="remove">remove</a> ' + '<a href="#" class="show-comments">comments</a> ' + post.text +
        commentsContainer + '</div>');
    }
  }

  var renderComments = function () {
    $('.comments-list').empty();

    for (var i = 0; i < posts.length; i += 1) {
      // the current post in the iteration
      var post = posts[i];

      // finding the "post" element in the page that is equal to the
      // current post we're iterating on... alertnatively we could have
      // used the data_attriubute, but the index is the same
      var $post = $('.posts').find('.post').eq(i);

      // iterate through each comment in our post's comments array
      for (var j = 0; j < post.comments.length; j += 1) {
        // the current comment in the iteration
        var comment = post.comments[j];

        // append the comment to the post we wanted to comment on
        $post.find('.comments-list').append(
          '<div class="comment">' + comment.text + 
          '<button class="btn btn-danger remove-comment">Remove Comment</button>' +
          '</div>'
        );
      };
    };
  };

  var removePost = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');

    var index = $clickedPost.index();

    posts.splice(index, 1);
    $clickedPost.remove();
  };

  var toggleComments = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
  };

  var createComment = function (text, postIndex) {
    var comment = { text: text };

    // pushing the comment into the correct posts array
    posts[postIndex].comments.push(comment);
  };

  var removeComment = function (commentButton) {
    // the comment element that we're wanting to remove
    var $clickedComment = $(commentButton).closest('.comment');

    // index of the comment element on the page
    var commentIndex = $clickedComment.index();

    // index of the post in the posts div that the comment belongs to
    var postIndex = $clickedComment.closest('.post').index();

    // removing the comment from the page
    $clickedComment.remove();

    // remove the comment from the comments array on the correct post object
    posts[postIndex].comments.splice(commentIndex, 1);
  };

  return {
    createPost: createPost,
    renderPosts: renderPosts,
    removePost: removePost,

    createComment: createComment,
    renderComments: renderComments,
    removeComment: removeComment,
    toggleComments: toggleComments
  };
};

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();
app.renderComments();

// Events
$('.add-post').on('click', function (e) {
  e.preventDefault();

  var text = $('#post-name').val();
  app.createPost(text);
  app.renderPosts();
  app.renderComments();
});

$('.posts').on('click', '.remove', function () {
  app.removePost(this);
});

$('.posts').on('click', '.show-comments', function () {
  app.toggleComments(this);
});

$('.posts').on('click', '.add-comment', function () {
  var text = $(this).siblings('.comment-name').val();

  // finding the index of the post in the page... will use it in #createComment
  var postIndex = $(this).closest('.post').index();

  app.createComment(text, postIndex);
  app.renderComments();
});

$('.posts').on('click', '.remove-comment', function () {
  app.removeComment(this);
});
>>>>>>> 94bbb049470be46ca9698bb9f508dabad78f5f37
