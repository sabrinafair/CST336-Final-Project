var executeSQL = require('../dbPool');

exports.landing_page = async function(req, res, next) {
  //sf working here
  //maybe some check here for if a user is logged in to post
  // (Check req.session.authenticated I believe not too sure about "express-sessions'")
  //if not put message in post textarea that says "Sign in to make a post :)"



  let sqlPostsInfo = `select u.idUser, u.fname, u.lname, p.idPost, p.text, p.likes, p.dislikes, c.comments from user u
join post p on u.idUser=p.poster join (select OriginalPost, count(*) as comments from comment group by OriginalPost) as c on c.OriginalPost = p.idPost`;
  let resultPostInfo = await executeSQL(sqlPostsInfo);

  let sqlCategories = `select distinct category from post`;
  let resultCategories = await executeSQL(sqlCategories);

  res.render('home', { "posts": resultPostInfo, "categories": resultCategories });
};

// can add more apis as needed
