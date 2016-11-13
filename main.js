var SpacebookApp = function() {

    var posts = [];
    var currentId = 0;
    var $posts = $(".posts")

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

        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);

        posts.forEach(function(post) {
            var newHTML = template(post);
            // append our new html to the page
            $posts.append(newHTML);
        })
    }

    function _addPost(newPost) {
        posts.push({ text: newPost, id: currentId, comments: [] })
        currentId++
    }

    function _updateCommentCount($commentsList, postIndex) {
        $post = $commentsList.closest('.post')
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(posts[postIndex]);
        //clear the old post
        $post.empty();
        //append the replacement post leaving the old div.post wrapper in place
        $post.append(newHTML);
        //to delete the old wrapper, step down a level and remove the parent 
        $replacementPost = $post.children()
        $replacementPost.unwrap();
        //we deleted the old $commentsList so we need to return the new list
        return $replacementPost.find('.comments-list')
    }

    function _updateComments($commentsList, postIndex) {
        $commentsList = _updateCommentCount($commentsList, postIndex) //need this to update comment count, yuck!
        $commentsList.empty()
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        posts[postIndex].comments.forEach(function(comment) {
            var newHTML = template(comment);
            // append our new html to the page
            $commentsList.append(newHTML);
        })
        return $commentsList
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
        var $commentsList = $(btn).closest('.post').find('.comments-list');
        var newComment = { text: $comment.val(), user: $user.val() };

        posts[postIndex].comments.push(newComment);

        $comment.val("");
        $user.val("");

        $commentsList = _updateComments($commentsList, postIndex)
        $commentsList.addClass('show');

        //viewComments($(btn).siblings('.view-comments'))
    }


    // var viewComments = function(btn) {
    //     var $commentsList = $(btn).closest('.post').find('.comments-list')
    //     var postIndex = $(btn).closest('.post').index();
    //     $commentsList = _updateComments($commentsList, postIndex)
    //     $hideBtn = $commentsList.closest(".post").find('.hide-comments')
    //     $hideBtn.removeClass('hidden')
    //     $hideBtn.siblings('.view-comments').addClass('hidden');
    // }

    // var hideComments = function(btn) {
    //     $(btn).addClass('hidden');
    //     $(btn).closest('.post').find('.view-comments').removeClass('hidden');
    //     var $commentsList = $(btn).closest('.post').find('.comments-list');
    //     $commentsList.empty();
    // }

    var toggleComments = function(btn) {
        var $commentsList = $(btn).closest('.post').find('.comments-list');
        $commentsList.toggleClass('show');
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
        // viewComments: viewComments,
        // hideComments: hideComments,
        deleteComment: deleteComment,
        toggleComments: toggleComments
    }
}


var app = SpacebookApp();
var post = app.post;
var $posts = $(".posts")

$posts.on('click', '.remove-post', function() {
    app.removePost(this);
});

$posts.on('click', '.add-comment', function() {
    app.addComment(this);
});

// $posts.on('click', '.view-comments', function() {
//     app.viewComments(this);
// });

// $posts.on('click', '.hide-comments', function() {
//     app.hideComments(this);
// });

$posts.on('click', '.remove-comment', function() {
    app.deleteComment(this);
});

$posts.on('click', '.toggle-comments', function() {
    app.toggleComments(this);
});
