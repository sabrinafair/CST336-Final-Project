var executeSQL = require('../dbPool');

exports.landing_page = async function(req, res, next) {
  //sf working here
  //maybe some check here for if a user is logged in to post
  // (Check req.session.authenticated I believe not too sure about "express-sessions'")
  //if not put message in post textarea that says "Sign in to make a post :)"

  //This Query is kinda long...
  let sqlPostsInfo = `select u.iduser, u.fname, u.lname, u.username, p.idPost, p.text, p.title, IFNULL(l.likes, 0) likes, IFNULL(dl.dislikes, 0) dislikes,  IFNULL(c.comments, 0) comments
from post p join user u on p.poster=u.idUser
left join
			(select originalPost, count(*) likes from postlikes
			 where postlike=1
			 group by originalPost) as l on p.idPost=l.originalPost
left join
			(select originalPost, count(*) dislikes from postlikes
			 where postlike=0
			 group by originalPost) as dl on p.idPost=dl.originalPost
left join
			(select originalPost, count(*) comments from comment
			 group by originalPost) as c on p.idPost=c.originalPost
        group by p.idPost
        order by p.idPost desc`;


  let resultPostInfo = await executeSQL(sqlPostsInfo);
  let sqlCategories = `select distinct category from post`;
  let resultCategories = await executeSQL(sqlCategories);
  let userLikedPosts = [];
  let userDislikedPosts = [];

  //check which posts user has likes to display in page
  if (req.session.authenticated != undefined) {
    let likedPosts = "SELECT p.idPost, pl.idUser, pl.postlike FROM post p join postlikes pl on pl.OriginalPost = p.idPost WHERE pl.idUser = ? AND postlike = true";
    let likedPostResults = await executeSQL(likedPosts, req.session.userId);
    for (let x = 0; x < likedPostResults.length; x++) {
      userLikedPosts.push(likedPostResults[x].idPost);
    }

    let dislikedPosts = "SELECT p.idPost, pl.idUser, pl.postlike FROM post p join postlikes pl on pl.OriginalPost = p.idPost WHERE pl.idUser = ? AND postlike = false";
    let dislikedPostResults = await executeSQL(dislikedPosts, req.session.userId);
    for (let x = 0; x < dislikedPostResults.length; x++) {
      userDislikedPosts.push(dislikedPostResults[x].idPost);
    }
    // console.log("LIKED POSTS", userLikedPosts);
    // console.log("DISLIKED POSTS", userDislikedPosts);
  }

  res.render('home',
    {
      "session": req.session,
      "posts": resultPostInfo,
      "likedPosts": userLikedPosts,
      "dislikedPosts": userDislikedPosts,
      "categories": resultCategories
    });
};

exports.newPost = async function(req, res, next) {
  let newPostSql = `insert into post (poster, category, text, title) value (?, ?, ?, ?)`;

  let params = [req.session.userId, req.query.category, req.query.post, req.query.title];

  console.log(params);

  let results = await executeSQL(newPostSql, params);

  //Changed to Redirect for now
  res.redirect('/home');

  //   let sqlPostsInfo = `select u.iduser, u.fname, u.lname, p.idPost, p.text, IFNULL(l.likes, 0) likes, IFNULL(dl.dislikes, 0) dislikes,  IFNULL(c.comments, 0) comments
  // from post p join user u on p.poster=u.idUser
  // left join
  // 			(select originalPost, count(*) likes from postlikes
  // 			 where postlike=1
  // 			 group by originalPost) as l on p.idPost=l.originalPost
  // left join
  // 			(select originalPost, count(*) dislikes from postlikes
  // 			 where postlike=0
  // 			 group by originalPost) as dl on p.idPost=dl.originalPost
  // left join
  // 			(select originalPost, count(*) comments from comment
  // 			 group by originalPost) as c on p.idPost=c.originalPost
  // group by p.idPost
  // order by p.idPost desc`;

  //   let resultPostInfo = await executeSQL(sqlPostsInfo);

  //   let sqlCategories = `select distinct category from post`;
  //   let resultCategories = await executeSQL(sqlCategories);

  // res.render('home',
  //   {
  //     "session": req.session,
  //     "posts": resultPostInfo,
  //     "categories": resultCategories
  //   });
};

exports.addComment = async function(req, res, next) {
  let OGPostId = req.query.ogPost;
  let comment = req.query.comment;
  let commenterId = req.session.userId;
  console.log("ogPost = " + OGPostId + "\ncomment = " + comment + "\ncommenterId: " + req.session.userId);

  if(typeof commenterId == "undefined"){
    console.log("cannot comment");
  }else{
    let commentSql = `insert into comment (OriginalPost, commenter, text) values (?, ?, ?)`;
    let params = [OGPostId, commenterId, comment];
    let results = await executeSQL(commentSql, params);
    console.log("Commented!");
  }
  
  res.redirect('/home');
};