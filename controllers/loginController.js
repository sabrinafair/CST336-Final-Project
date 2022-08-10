var executeSQL = require('../dbPool');
const validate = require("../formValidation");
const saltRounds = 10;

//Main Driver functions for the forum categories

// retrieve
exports.login_get = function(req, res) {
  if (req.session.authenticated != undefined) {
    res.redirect("/home");
    return;
  }
  res.render('login');
};

//Display
exports.login_post = async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (! await validate.usernameExits(username)) {
    res.render("login", { "formFeedback": "Username or password invalid" });
    return;
  }

  if (! await validate.passwordMatch(username, password)) {
    res.render("login", { "formFeedback": "Username or password invalid" });
    return;
  }

  let userInfo = "SELECT idUser, username, profilepic FROM user WHERE username = ?";
  let userResults = await executeSQL(userInfo, username);

  req.session.authenticated = true;
  req.session.username = userResults[0].username;
  req.session.profilePic = userResults[0].profilepic;
  req.session.userId = userResults[0].idUser;

  res.redirect('/home');
};