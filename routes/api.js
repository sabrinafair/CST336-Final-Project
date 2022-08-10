var express = require('express');
var router = express.Router();

var apiController = require('../controllers/apiController');
router.get('/', apiController.api_list);
router.get('/post', apiController.api_post_likes);
router.get('/post/:category', apiController.api_posts_by_category);

router.get('/comment', apiController.api_comment_likes);

//Retrieves all comments based on post ID
router.get('/comments/:postId', apiController.api_comments_by_post);
module.exports = router;