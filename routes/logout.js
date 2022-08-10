var express = require('express');
var router = express.Router();

var logoutController = require('../controllers/logoutController');

//equivalent to "....repl.co/login '
router.get('/', logoutController.logout_get);

module.exports = router;