class AjaxFunctions {
    constructor() { }

     fetch() {
        return $.get({
            url: '/posts'
        })
    }

     postUserData(userText) {
        return $.post('/posts', { text: userText })
            .then((savedPost) => {
                console.log(savedPost)
                return savedPost;
            })
    }

     removePostFromDB(postId) {
        return $.ajax('/posts/' + postId, {
            method: "DELETE",    
        }).then ((allPostsUpdated) => {
            console.log(allPostsUpdated);
            return allPostsUpdated;
        })
    }

     makeNewCommentInDB(newComment, postId) {
        return $.post('/postforcomment/'+ postId, newComment)
            .then((UpdPstWithComment) => {
                console.log(UpdPstWithComment)
                
            })
    }

    removeCommentFromPost(postId, commentId) {
        console.log(postId + commentId)
        return $.ajax('/deleteComment/' + postId + '/' + commentId, {
            method: "DELETE",    
        }).then ((postWithoutComment) => {
            console.log(PostWithoutComment);
            return PostWithoutComment;
        })
    }

} // end of class























export default AjaxFunctions


