var executeSQL = require('../dbPool');

//list of api's offered
exports.api_list = function (req,res,next){
  res.send("api_list Not Yet implemented.");
};
//Local API calls for dynamic serverside apicalls to meet requirements
exports.api_post_likes = function (req,res,next){
  res.send("api_post_likes Not Yet implemented.");
};

exports.api_comment_likes = function (req,res,next){
  res.send("api_comment_likes Not Yet implemented.");
};

// can add more apis as needed
exports.api_comments_by_post = async function (req,res){
  let postId = req.params.postId;

  let commentsSql = `select idComment, c.text, c.likes, c.dislikes, u.fname, u.lname from comment c
join user u on c.commenter=u.idUser 
where OriginalPost= ?`;
  commentsResults = await executeSQL(commentsSql, [postId]);
  res.send(commentsResults);
};