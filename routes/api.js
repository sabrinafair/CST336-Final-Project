var express = require('express');
var router = express.Router();

var apiController = require('../controllers/apiController');
router.get('/', apiController.api_list);
router.get('/post/:postId', apiController.api_post_likes);
router.get('/comment/:commentId', apiController.api_comment_likes);

//Retrieves all comments based on post ID
router.get('/comments/:postId', apiController.api_comments_by_post);
module.exports = router;