var executeSQL = require('../dbPool');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validate = require("../formValidation");

// app.get('/user/:username', async function (req,res){
// //Relevant sql calls and stuff
// res.render('user', {"session": req.session, "wateverElse": whateverelse });
// }

exports.user_get = async function(req, res) {
  //this function handles urls with the format repl.co/user/:username
  //the relevant route is in "/routes/user.js" but it is already set up. It requires this function as its driver code.

  // use 'req.params.username' to get the username from the url
  // for example on the request " https://otterforum.cmarket.repl.co/user/Werner9 "
  //Christians Comments ^^
  let username = req.params.username;
  let userInfoSql = `SELECT fName, lName, username, profilepic, bio FROM user WHERE username = ?`;
  // let userInfoSql = `SELECT fName, lName, username, IFNULL(profilepic, "/img/defaultProfilePic.png"), IFNULL(bio, "No bio yet. . .") FROM user where username = ?`;
  let userInfo = await executeSQL(userInfoSql, [username]);

  console.log(userInfo);

  // rendering /views/user.ejs
  res.render("user", { "session": req.session, "userInfo": userInfo });
};

exports.user_list = function(req, res, next) {
  res.send("USEr_list Not Yet implemented.");
};

//Handles form input for editing post, commenting or editing comments.
exports.user_post = function(req, res) {
  res.send("user_POST Not Yet implemented.");
};



exports.update_user = async function(req, res) {

  let username = req.params.username;
  let userInfoSql = `SELECT fName, lName, username, profilepic, bio FROM user WHERE username = ?`;
  if (req.session.authenticated == undefined || req.session.username != req.params.username) {
    return res.redirect("/");
  }

  let userInfo = await executeSQL(userInfoSql, [username]);


  console.log(userInfo);
  res.render('userUpdate', { "session": req.session, "userInfo": userInfo });
}

exports.update_user_post = async function(req, res) {
  let message = "";
  // let oldPass = req.session.password;
  let oldInputPass = req.body.oldpass;
  let newPass = req.body.newpass;
  let newPass2 = req.body.newpass2;
  let username = req.params.username;
  let newUsername = req.body.newusername;
  let originalInfoSql = `SELECT fName, lName, username, profilepic, bio FROM user WHERE username = ?`;

  let messageColorClass = "text-danger";

  let newPassesEqual = true;
  if(newPass !== newPass2){
    message = "New Passwords Don't Match";
    newPassesEqual = false;
   
  }
  
  // console.log("ORIGINAL SQL" + originalInfo);
  // console.log("Fname:" + req.body.fName + "\nLName: " + req.body.lName + "\nUsername: " + req.body.username + "\nBio: " + req.body.bio + "\noldInputPass: " + oldInputPass + "\nnewPass: " + newPass + "\nnewPass2: " + newPass2 + "\nnewUsername: " + newUsername);

  if(await validate.passwordMatch(username, oldInputPass) && newPassesEqual){
  
  let updatedPassword = await bcrypt.hash(req.body.newpass, saltRounds);

  let updateUserInfo = "";
  let updateUserParams = [];

  //testing 'express-fileupload' will probably scrap later
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log('No files were uploaded.');
    updateUserInfo = "UPDATE user SET fname = ?, lname = ?, password = ?, username = ?, bio = ? where idUser = ?";
    updateUserParams = [req.body.fName, req.body.lName, updatedPassword, req.body.newusername, req.body.bio, req.session.userId];
  } else {
    updateUserInfo = "UPDATE user SET fname = ?, lname = ?, password = ?, username = ?, bio = ?, profilepic = ? where idUser = ?";
    profilePic = req.files.profilePic;
    uploadPath = '/home/runner/OtterForum/public/img/profilepics/' + profilePic.name;
    console.log(req.files.profilePic);
    console.log(req.files.profilePic.name);
    console.log(req.files.profilePic.mimetype);
    updateUserParams = [req.body.fName, req.body.lName, updatedPassword, req.body.newusername, req.body.bio, profilePic.name, req.session.userId];
    profilePic.mv(uploadPath, function(err) {
      if (err) {
        console.log("Error uploading file!")
        return res.status(500).send(err);
      }
      console.log(`File Upload Recieved! ${profilePic}`);
      req.session.profilePic = profilePic.name;
    });
  }
  // req.session.profilePic = profilePic.name;
  await executeSQL(updateUserInfo, updateUserParams);
    username = newUsername;
  // let newInfo = await executeSQL(originalInfoSql, [username]);
  message= "Update Successful!";
     messageColorClass = "text-success";
  }
  
  let newInfo = await executeSQL(originalInfoSql, [username]);
  res.render('userUpdate', { "session": req.session, "userInfo": newInfo, "message": message, "msgColor": messageColorClass });
}