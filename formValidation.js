const executeSQL = require("./dbPool");
const bcrypt = require('bcrypt');
//reusable functions to validate forms

// Used for signup page to ensure no special characters are  used for username
exports.specialCharacters = function (str) {
  const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
};

exports.usernameExits = async function (username) {
  let checkUsername = "SELECT username FROM user WHERE username = ?";
  let usernameResults = await executeSQL(checkUsername, username);
  if (usernameResults.length > 0 ){
    return true;
  } else {
    return false;
  }
};

exports.passwordMatch = async function (username, password) {
  let sql = "SELECT password FROM user WHERE username = ?";
  let results = await executeSQL(sql,username);
  let hash = results[0].password;

  if ( await bcrypt.compare(password, hash) ) {
    console.log(`${username}: Authentication Successful`);
    return true;
  } else {
    console.log("Authentication Unsuccessful");
    return false;
  }
};