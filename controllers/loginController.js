// var executeSQL = require('../dbPool');
const validate = require("../formValidation");
const saltRounds = 10;

//Main Driver functions for the forum categories

// retrieve
exports.login_get = function(req, res) {
  res.render('login');
};

//Display
exports.login_post = async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (! await validate.usernameExits(username)) {
    res.render("login", { "formFeedback": "Username or password invalid"});
    return;
  }
  
  if (! await validate.passwordMatch(username, password)) {
    res.render("login", { "formFeedback": "Username or password invalid"});
    return;
  }
  req.session.authenticated = true;
  req.session.authenticatedUser = username;
  console.log(req.session);
  
  res.render('login');
};