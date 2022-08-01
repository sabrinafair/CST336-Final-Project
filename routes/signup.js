const express = require('express');
// const pool = require("../dbPool");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const signupController = require('../controllers/signupController');

//equivalent to "....repl.co/signup '
router.get('/', signupController.signup_get);

router.post('/', signupController.signup_post);

module.exports = router;