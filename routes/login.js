var express = require('express');
var router = express.Router();

var loginController = require('../controllers/loginController');

//equivalent to "....repl.co/login '
router.get('/', loginController.login_get);

router.post('/', loginController.login_post);

module.exports = router;