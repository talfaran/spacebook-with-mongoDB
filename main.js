var posts = [];
var currentId = 0;
var commentId


function post(btn) {

    var input = $(btn).closest("form").find("input");
    var post = input.val()
    if (post === "") {
        alert("Please enter text!");

    } else {
        addPost(post)
        input.val("")
        updatePosts()
    }
}


function updatePosts() {

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

var addPost = function(newPost) {
    posts.push({ text: newPost, id: currentId, comments: [] })
    currentId++
}

function removePost(btn) {

    //use jQuery to get id
    var id = $(btn).closest(".post").data().id;
    //remove post from array
    posts = posts.filter(function(post) {
        return post.id != id
    })
    updatePosts();
}

function updateComments($commentsList, postIndex) {
    $commentsList.empty()
    posts[postIndex].comments.forEach(function(comment) {
        $commentsList.append('<li class="comment">' + comment.text + " - " + comment.user +
            '<button type="button" class="btn btn-sm btn-danger remove-comment">Remove Comment</button></li>')
    })
}

function addComment(btn) {

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
        updateComments($commentsList, postIndex)
    }
}


function viewComments(btn) {

    $(btn).addClass('hidden');
    $(btn).closest('.post').find('.hide-comments').removeClass('hidden')

    var $commentsList = $(btn).closest('.post').find('.comments-list')
    var postIndex = $(btn).closest('.post').index();

    updateComments($commentsList, postIndex)
}

function hideComments(btn) {
    $(btn).addClass('hidden');
    $(btn).closest('.post').find('.view-comments').removeClass('hidden');

    var $commentsList = $(btn).closest('.post').find('.comments-list');

    $commentsList.empty();

}

function deleteComment(btn) {
    var $commentsList = $(btn).closest('.post').find('.comments-list')
    var postIndex = $(btn).closest('.post').index();
    var commentIndex = $(btn).closest('.comment').index();

    //remove the comment and refresh the view
    posts[postIndex].comments.splice(commentIndex, 1);
    updateComments($commentsList, postIndex)
}

$(document).ready(function() {

    $('.posts').on('click', '.remove-post', function() {
        removePost(this);
    });

    $('.posts').on('click', '.add-comment', function() {
        addComment(this);
    });

    $('.posts').on('click', '.view-comments', function() {
        viewComments(this);
    });

    $('.posts').on('click', '.hide-comments', function() {
        hideComments(this);
    });


    $('.posts').on('click', '.remove-comment', function() {
        deleteComment(this);
    });

    // $("button.add-post").click(function(event) {
    //     var post = $("#post-name").val();
    //     if (post === "") {
    //         alert("Please enter text!");
    //     } else {
    //         addPost(post)
    //     }
    //     return false;
    // });

});
