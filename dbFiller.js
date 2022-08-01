//This file will generate fake user,comment, and post data
var executeSQL = require("./dbPool");
var validator = require("./formValidation.js");
var jsfaker = require('@faker-js/faker');
var us = require('underscore');
var faker = jsfaker.faker;
const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const bcrypt = require('bcrypt');
const saltRounds = 10;


// generatePost();
generateComment();
// generateUser();
async function generateUser() {
  for (let i = 0; i < 100; i++) {
    let username = faker.internet.userName().replace(specialChars, '');
    let password = await bcrypt.hash("password", saltRounds);
    let fName = faker.name.firstName();
    let lName = faker.name.lastName();
    let profilePic = faker.internet.avatar();
    if (! await validator.usernameExits(username)) {

      let insertUser = "INSERT INTO user (fName, lName, username, password, profilepic) VALUES (?,?,?,?,?)";
      let userParams = [fName, lName, username, password, profilePic];
      let insertResults = await executeSQL(insertUser, userParams);
      console.log(insertResults);

      // let updateUser = "UPDATE user SET fName = ?, lName = ?, username = ?, password = ?, profilepic = ? WHERE idUser = ?";
      // let updateUserParams = [fName, lName, username, password, profilePic, i ];
      // let updateResults = await executeSQL(updateUser, updateUserParams);
      // console.log(updateResults);

    }
  }
  return;
};

async function generateComment() {
  let getPosts = "SELECT * FROM post";
  let postResults = await executeSQL(getPosts);

  let getUsers = "Select * FROM user";
  let userResults = await executeSQL(getUsers);

  let userList = [];
  for (user of userResults){
    userList.push(user.idUser);
  }
  console.log(userList);

  let insertComment = "INSERT INTO comment (text, commenter, likes, dislikes, OriginalPost) VALUES(?,?,?,?,?)";
  for (post of postResults) {
    for (let i = 0; i < us.random(1,3); i++) {
      let insertCommentParams = [faker.lorem.sentence(), userList[0],0,0, post.idPost];
      let insertCommentResults = await executeSQL(insertComment, insertCommentParams)
      userList = us.shuffle(userList);
    }
  }

};
async function generatePost() {
  let getUser = "SELECT * FROM user";
  let userResults = await executeSQL(getUser);
  for (user of userResults) {
    console.log(user.username);
  }
  return;
};