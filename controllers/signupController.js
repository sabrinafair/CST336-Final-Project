const executeSQL = require("../dbPool");
const validate = require("../formValidation");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// retrieve signup page
exports.signup_get = function(req, res) {
  res.render("signup");
};

//Display
exports.signup_post = async function(req, res) {
  let username = req.body.username;
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let password = await bcrypt.hash(req.body.password, saltRounds);
  let parameters = [firstName, lastName, username, password];
  
  //Check if there are special characters in username
  if (validate.specialCharacters(username)) {
    res.render("signup", { "passwordFeedback": "Invalid Username: Do not include special characteres" });
    return;
  }

  //Check if username is already in database
  if (await validate.usernameExits(username)) {
    res.render("signup", { "passwordFeedback": "Username is taken" });
    return;
  }

  let sql = "INSERT INTO user (fName, lName, username, password) VALUES (?,?,?,?)";

  let results = await executeSQL(sql, parameters);
  console.log(`A User has signed up the the database!: ${username}`);
  
  res.render("signup", { "message": "Successfully Signed up!" });
};