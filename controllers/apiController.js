const { result } = require('lodash');
var executeSQL = require('../dbPool');

const getPostLikes = `select p.idPost, ifnull(l.likes, 0) as likes, ifnull(dl.dislikes, 0) as dislikes, ul.postlike
from post p
         left join (select OriginalPost, count(*) as likes from postlikes where postlike = true group by OriginalPost
                   ) as l
                   on l.OriginalPost = p.idPost
         left join (select OriginalPost, count(*) as dislikes
                    from postlikes
                    where postlike = false
                    group by OriginalPost
                   ) as dl
                   on dl.OriginalPost = p.idPost
         left join (select OriginalPost, postlike
                    from postlikes
                    where idUser = ?
                   ) as ul
                   on ul.OriginalPost = p.idPost
where idPost = ?`;

const getCommentLikes = `select c.idComment, IFNULL(l.likes,0) as likes, IFNULL(dl.dislikes, 0) as dislikes, commentlike
from comment c
         left join (select originalComment, count(*) as likes from commentlikes where commentlike = true group by originalComment) as l
                   on l.originalComment = c.idComment
         left join (select originalComment, count(*) as dislikes from commentlikes where commentlike = false group by originalComment) as dl
                   on dl.originalComment = c.idComment
          left join (select originalComment, commentlike from commentlikes where idUser = ? ) as ul
                  on ul.originalComment = c.idComment
where idComment = ?`;

//list of api's offered
exports.api_list = function(req, rest) {
  res.send("api_list Not Yet implemented.");
};
exports.api_posts_by_category = async function(req, res) {
  let sql = "";
  let params = [];
  if (req.session.authenticated != undefined) {
     sql = `select u.iduser, u.fname, u.lname, u.username, p.idPost, p.category, p.text, p.title, IFNULL(l.likes, 0) likes, IFNULL(dl.dislikes, 0) dislikes,  IFNULL(c.comments, 0) comments, ul.postlike
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
left join 
      (select originalPost, postlike from postlikes where idUser = ? group by originalPost) as ul
      on ul.originalPost = p.idPost
where p.category = ?
group by p.idPost
order by p.idPost `;
params = [req.session.userId, req.params.category];
  } else {
    sql = `select u.iduser, u.fname, u.lname, u.username, p.idPost, p.category, p.text, p.title, IFNULL(l.likes, 0) likes, IFNULL(dl.dislikes, 0) dislikes,  IFNULL(c.comments, 0) comments
from post p join user u on p.poster=u.idUser
left join
			(select originalPost, count(*) likes from postlikes
			 where postlike = true
			 group by originalPost) as l on p.idPost=l.originalPost
left join
			(select originalPost, count(*) dislikes from postlikes
			 where postlike = false
			 group by originalPost) as dl on p.idPost=dl.originalPost
left join
			(select originalPost, count(*) comments from comment
			 group by originalPost) as c on p.idPost=c.originalPost
where p.category = ?
group by p.idPost
order by p.idPost `;
params = [req.params.category];
  }
  let postsByCategory = await executeSQL(sql, params);
  res.send(postsByCategory);
};
exports.api_comments_by_post = async function(req, res) {
  let postId = req.params.postId;
  let commentsSql = "";
  let params = [];
  if (req.session.authenticated) {
    console.log(req.session.authenticated);
    commentsSql = `select c.idComment, c.text, ifnull(cl.likes, 0) likes, ifnull(cdl.dislikes, 0) dislikes, u.fname, u.lname, ul.commentlike
from comment c
         join user u
              on c.commenter = u.idUser
         left join (select originalComment, count(*) as likes
                    from commentlikes
                    where commentlike = true
                    group by originalComment
                   ) as cl
                   on cl.originalComment = c.idComment
         left join (select originalComment, count(*) as dislikes
                    from commentlikes
                    where commentlike = false
                    group by originalComment
                   ) as cdl
                   on cdl.originalComment = c.idComment
         left join (select originalComment, commentlike
                    from commentlikes
                    where idUser = ?
                   ) as ul
                    on ul.originalComment = c.idComment
where OriginalPost = ?`;
    params = [req.session.userId, postId];
  } else {
    console.log(req.session.authenticated);
    commentsSql = `select c.idComment, c.text, ifnull(cl.likes, 0) likes, ifnull(cdl.dislikes, 0) dislikes, u.fname, u.lname
from comment c
         join user u
              on c.commenter = u.idUser
         left join (select originalComment, count(*) as likes
                    from commentlikes
                    where commentlike = true
                    group by originalComment) as cl
                   on cl.originalComment = c.idComment
         left join (select originalComment, count(*) as dislikes
                    from commentlikes
                    where commentlike = false
                    group by originalComment) as cdl
                   on cdl.originalComment = c.idComment
where OriginalPost = ?`;
    params = [postId];
  }

  commentsResults = await executeSQL(commentsSql, params);
  res.send(commentsResults);
};

exports.api_post_likes = async function(req, res) {
  //check if query is proper format (/api/post?action=whateverAction&postId=whateverId")
  if (req.query.action == undefined || req.query.id == undefined) {
    res.send("Malformed query use format '/api/post?action=whateverAction&postId=whateverId'");
    return;
  }

  let userId = req.session.userId;
  let postId = req.query.id;
  //Session must be active in order to use api (Logged in)
  if (req.session.userId == undefined) {
    res.send("Must be Logged in to like/dislike");
    return;
  }

  if (! await postExists(postId)) {
    res.send("Post Doesn't exist!");
    return;
  }

  switch (req.query.action) {
    case "like":
      await insertPostLike(postId, userId);
      break;
    case "dislike":
      await insertPostDislike(postId, userId);
      break;
    default:
      res.send("Unknown action command: Supported commands are like, dislike, and undo");
      return;
  }

  console.log(`API Post_Likes: "${req.session.username}" Action:(${req.query.action}) on Post:${req.query.id}`);
  let postLikesResults = await executeSQL(getPostLikes, [userId, postId]);
  res.send(postLikesResults[0]);
};

exports.api_comment_likes = async function(req, res) {
  if (req.query.action == undefined || req.query.id == undefined) {
    res.send("Malformed query use format '/api/comment?action=whateverAction&postId=whateverId' ");
    return;
  }

  let userId = req.session.userId;
  let commentId = req.query.id;
  //Session must be active in order to use api (Logged in)
  if (req.session.userId == undefined) {
    res.send("Must be Logged in to like/dislike");
    return;
  }

  if (! await commentExists(commentId)) {
    res.send("Post Doesn't exist!");
    return;
  }

  switch (req.query.action) {
    case "like":
      await insertCommentLike(commentId, userId);
      break;
    case "dislike":
      await insertCommentDislike(commentId, userId);
      break;
    default:
      res.send("Unknown action command: Supported commands are like, dislike, and undo");
      return;
  }
  console.log(`API Comment_Like: "${req.session.username}" Action:(${req.query.action}) on Post:${req.query.id}`);
  let commentLikesResults = await executeSQL(getCommentLikes, [req.session.userId, commentId]);
  res.send(commentLikesResults[0]);
};

// can add more apis as needed


exports.api_commentLikes_by_user = async function(req, res) {

}

// INSERT, UPDATE, and DELETE post likes
async function insertPostLike(postId, userId) {
  let likeQuery = "";
  let likeParams = [postId, userId];

  let results = await postLikeExists(postId, userId);
  if (results.length > 0) {
    if (results[0].postlike == false) {
      likeQuery = "UPDATE postlikes SET postlike = true WHERE originalPost = ? AND idUser = ?";
    } else {
      likeQuery = "DELETE FROM postlikes WHERE originalPost = ? AND idUser = ? AND postlike = true";
    }
  } else {
    likeQuery = "INSERT INTO postlikes (OriginalPost, idUser, postlike) VALUES (?,?,true)";
  }
  return await executeSQL(likeQuery, likeParams);
}

async function insertPostDislike(postId, userId) {
  let likeQuery = "";
  let likeParams = [postId, userId];

  let results = await postLikeExists(postId, userId);
  if (results.length > 0) {
    if (results[0].postlike == true) {
      likeQuery = "UPDATE postlikes SET postlike = false WHERE originalPost = ? AND idUser = ?";
    } else {
      likeQuery = "DELETE FROM postlikes WHERE originalPost = ? AND idUser = ?";
    }
  } else {
    likeQuery = "INSERT INTO postlikes (OriginalPost, idUser, postlike) VALUES (?,?,false)";
  }
  return await executeSQL(likeQuery, likeParams);
};

// COMMENT HELPER SQL FUNCTIONS
async function insertCommentLike(commentId, userId) {
  let likeQuery = "";
  let likeParams = [commentId, userId];
  let results = await commentLikeExists(commentId, userId);
  if (results.length > 0) {
    if (results[0].commentlike == false) {
      likeQuery = "UPDATE commentlikes SET commentlike = true WHERE originalComment = ? AND idUser = ? ";
    } else {
      likeQuery = "DELETE FROM commentlikes WHERE originalComment = ? AND idUser = ? ";
    }
  } else {
    likeQuery = "INSERT INTO commentlikes (originalComment, idUser, commentlike) VALUES (?,?,true)";
  }
  return await executeSQL(likeQuery, likeParams);
}

async function insertCommentDislike(commentId, userId) {
  let likeQuery = "";
  let likeParams = [commentId, userId];
  let results = await commentLikeExists(commentId, userId);
  if (results.length > 0) {
    if (results[0].commentlike == true) {
      likeQuery = "UPDATE commentlikes SET commentlike = false WHERE originalComment = ? AND idUser = ? ";
    } else {
      likeQuery = "DELETE FROM commentlikes WHERE originalComment = ? AND idUser = ? ";
    }
  } else {
    likeQuery = "INSERT INTO commentlikes (originalComment, idUser, commentlike) VALUES (?,?,false)";
  }
  return await executeSQL(likeQuery, likeParams);
};


//HELPER SQL functions
async function postExists(postId) {
  let lookupPost = "Select * from post where idPost = ?";
  let lookupPostParams = [postId];
  let postResults = await executeSQL(lookupPost, lookupPostParams);
  return postResults;
}
async function postLikeExists(postId, userId) {
  let lookupLike = "SELECT * FROM postlikes where originalPost = ? AND idUser = ? ";
  let lookupLikeParams = [postId, userId];
  let lookupResults = await executeSQL(lookupLike, lookupLikeParams);
  return lookupResults;
}

async function commentExists(commentId) {
  let lookupPost = "Select * from comment where idComment = ?";
  let lookupPostParams = [commentId];
  let postResults = await executeSQL(lookupPost, lookupPostParams);
  return postResults;
}

async function commentLikeExists(commentId, userId) {
  let lookupLike = "SELECT * FROM commentlikes where originalComment = ? AND idUser = ? ";
  let lookupLikeParams = [commentId, userId];
  let lookupResults = await executeSQL(lookupLike, lookupLikeParams);
  return lookupResults;
}
