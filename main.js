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
