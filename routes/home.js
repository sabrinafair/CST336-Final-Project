var express = require('express');
var router = express.Router();

var homeController = require('../controllers/homeController');
router.get('/', homeController.landing_page);
router.get('/comment', homeController.addComment);  //sf here
router.get('/newPost', homeController.newPost);
module.exports = router;