var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

//equivalent to "....repl.co/user/ '
router.get('/', userController.user_list);

//equivalent to "....repl.co/user/:username '
router.get('/:username', userController.user_get);
router.post('/:username', userController.user_post);

module.exports = router;