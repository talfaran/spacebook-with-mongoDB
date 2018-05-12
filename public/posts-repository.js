/**
 * @class Responsible for storing and manipulating Spacebook posts, in-memory
 */
import AjaxFunctions from './postAjxRec.js';

class PostsRepository {
    constructor() {
        this.posts = [];
        this.AjaxFunctionsApi = new AjaxFunctions();
    }

      getpostfromDB() {
       return  this.AjaxFunctionsApi.fetch((postFromDB) => {
             this.posts = postFromDB;
         });


    }

    addPost(postText) {
      return  this.AjaxFunctionsApi.postUserData(postText);
        
    }

    removePost(postId) {
      return this.AjaxFunctionsApi.removePostFromDB(postId).then((allUpdatedPosts) => {
            console.log(allUpdatedPosts)
            this.posts = allUpdatedPosts
            })
        
         
    }

    addComment(newComment, postId) {
     return this.AjaxFunctionsApi.makeNewCommentInDB(newComment, postId)
      
    };

    deleteComment(postId, commentId) {
        return this.AjaxFunctionsApi.removeCommentFromPost(postId, commentId)
    };
}

export default PostsRepository