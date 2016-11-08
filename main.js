var SpacebookApp = function() {

    var posts = [];
    var currentId = 0;

    var post = function(btn) {

        var input = $(btn).closest("form").find("input");
        var post = input.val()
        if (post === "") {
            alert("Please enter text!");

        } else {
            _addPost(post)
            input.val("")
            _updatePosts()
        }
    }


    function _updatePosts() {

        $('.posts').empty();
        posts.forEach(function(post) {

            var commentsContainer = '<div class="comments-container">' + '<ul class=comments-list></ul>' +
                '<input class="form-control name" type="text" placeholder="Name">' +
                '<input class="form-control comment" type="text" placeholder="Comment">' +
                '<button type="button" class="btn btn-sm btn-primary add-comment">Post Comment</button>' +
                '<button type="button" class="btn btn-sm btn-primary view-comments">View Comments</button>' +
                '<button type="button" class="btn btn-sm btn-primary hide-comments hidden">Hide Comments</button> </div>';

            $('.posts').append('<div class="post" data-id="' + post.id + '">' + post.text +
                '<button type="button" class="btn btn-danger remove-post">Remove Post</button>' + commentsContainer + '</div>')
        })
    }

    function _addPost(newPost) {
        posts.push({ text: newPost, id: currentId, comments: [] })
        currentId++
    }

    function _updateComments($commentsList, postIndex) {
        $commentsList.empty()
        posts[postIndex].comments.forEach(function(comment) {
            $commentsList.append('<li class="comment">' + comment.text + " - " + comment.user +
                '<button type="button" class="btn btn-sm btn-danger remove-comment">Remove Comment</button></li>')
        })
    }

    var removePost = function(btn) {

        //use jQuery to get id
        var id = $(btn).closest(".post").data().id;
        //remove post from array
        posts = posts.filter(function(post) {
            return post.id != id
        })
        _updatePosts();
    }



    var addComment = function(btn) {

        var $comment = $(btn).siblings('.comment');
        var $user = $(btn).siblings('.name');

        if ($comment.val() === "" || $user.val() === "") {
            alert("Please enter your name and a comment!")
            return;
        }

        // finding the index of the post in the page... we will use it in #createComment
        var postIndex = $(btn).closest('.post').index();

        var newComment = { text: $comment.val(), user: $user.val() };

        posts[postIndex].comments.push(newComment);

        $comment.val("");
        $user.val("");

        if ($(btn).closest('.post').find('.view-comments').hasClass('hidden')) {
            var $commentsList = $(btn).closest('.post').find('.comments-list')
            _updateComments($commentsList, postIndex)
        }

        viewComments($(btn).siblings('.view-comments'))
    }


    var viewComments = function(btn) {

        $(btn).addClass('hidden');
        $(btn).closest('.post').find('.hide-comments').removeClass('hidden')

        var $commentsList = $(btn).closest('.post').find('.comments-list')
        var postIndex = $(btn).closest('.post').index();

        _updateComments($commentsList, postIndex)
    }

    var hideComments = function(btn) {
        $(btn).addClass('hidden');
        $(btn).closest('.post').find('.view-comments').removeClass('hidden');

        var $commentsList = $(btn).closest('.post').find('.comments-list');

        $commentsList.empty();

    }

    var deleteComment = function(btn) {
        var $commentsList = $(btn).closest('.post').find('.comments-list')
        var postIndex = $(btn).closest('.post').index();
        var commentIndex = $(btn).closest('.comment').index();

        //remove the comment and refresh the view
        posts[postIndex].comments.splice(commentIndex, 1);
        _updateComments($commentsList, postIndex)
    }


    return {
        post: post,
        removePost: removePost,
        addComment: addComment,
        viewComments: viewComments,
        hideComments: hideComments,
        deleteComment: deleteComment
    }

}


var app = SpacebookApp();
var post = app.post;

$('.posts').on('click', '.remove-post', function() {
    app.removePost(this);
});

$('.posts').on('click', '.add-comment', function() {
    app.addComment(this);
});

$('.posts').on('click', '.view-comments', function() {
    app.viewComments(this);
});

$('.posts').on('click', '.hide-comments', function() {
    app.hideComments(this);
});

$('.posts').on('click', '.remove-comment', function() {
    app.deleteComment(this);
});
