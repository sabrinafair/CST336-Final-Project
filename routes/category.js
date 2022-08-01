var express = require('express');
var router = express.Router();

var categoryController = require('../controllers/categoryController');
var postController  = require('../controllers/postController');

//equivalent to "....repl.co/cat/ '
//display list of forum categories
router.get('/', categoryController.category_list);

//equivalent to "....repl.co/cat/:category '
// list all posts of a specific category
router.get('/:category/', categoryController.category_get);

//equivalent to "....repl.co/:cat/:postId '
router.get('/:category/:postId', postController.post_get);
router.post('/:category/:postId', postController.post_post);

module.exports = router;