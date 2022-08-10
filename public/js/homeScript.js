//Event Listeners
console.log("home scripts running");
document.querySelector(".category-select").addEventListener("change", categoryChosen);
document.getElementById("goto").addEventListener("click", goTo);
postLikeAPI();
commentLikeAPI();

//post Likes/Dislikes API
async function postLikeAPI() {
  likeButtons = document.querySelectorAll(".post-likes");
  for (likeButton of likeButtons) {
    let postId = parseInt(likeButton.id.replace(/[a-z]/gi, ""));
    likeButton.addEventListener("click", async function() {
      let likeAPI = `https://otterforum.cmarket.repl.co/api/post?action=like&id=${postId}`;
      let response = await fetch(likeAPI);
      let postData = await response.json();
      document.querySelector(`#likecount${postId}`).innerHTML = postData.likes;
      dislikeCount = document.querySelector(`#dislikecount${postId}`).innerHTML = postData.dislikes;
      likebtn = document.querySelector(`#pl${postId}`);
      dislikebtn = document.querySelector(`#pdl${postId}`);
      if (postData.postlike == null) {
        likebtn.className = "post-likes btn btn-sm btn-outline-success";
        dislikebtn.className = "post-dislikes btn btn-sm btn-outline-danger";
      } else if (postData.postlike == true) {
        likebtn.className = "post-likes btn btn-sm btn-success";
        dislikebtn.className = "post-dislikes btn btn-sm btn-outline-danger";
      } else {
        likebtn.className = "post-likes btn btn-sm btn-outline-success";
        dislikebtn.className = "post-dislikes btn btn-sm btn-danger";
      }
    });
  }

  //post Likes/Dislikes API
  dislikeButtons = document.querySelectorAll(".post-dislikes");
  for (dislikeButton of dislikeButtons) {
    let postId = parseInt(dislikeButton.id.replace(/[a-z]/gi, ""));
    dislikeButton.addEventListener("click", async function() {
      let dislikeAPI = `https://otterforum.cmarket.repl.co/api/post?action=dislike&id=${postId}`;
      let response = await fetch(dislikeAPI);
      let postData = await response.json();
      document.querySelector(`#likecount${postId}`).innerHTML = postData.likes;
      dislikeCount = document.querySelector(`#dislikecount${postId}`).innerHTML = postData.dislikes;

      likebtn = document.querySelector(`#pl${postId}`);
      dislikebtn = document.querySelector(`#pdl${postId}`);

      if (postData.postlike == null) {
        likebtn.className = "post-likes btn btn-outline-success";
        dislikebtn.className = "post-dislikes btn btn-outline-danger";
      } else if (postData.postlike == true) {
        likebtn.className = "post-likes btn btn-success";
        dislikebtn.className = "post-dislikes btn btn-outline-danger";
      } else {
        likebtn.className = "post-likes btn btn-outline-success";
        dislikebtn.className = "post-dislikes btn btn-danger";
      }
    });
  }
}

async function commentLikeAPI() {
  commentButtons = document.querySelectorAll(".comment-btn");
  for (commentButton of commentButtons) {
    commentButton.addEventListener("click", getComments);
  }
}


async function getComments() {
  var myModal = new bootstrap.Modal(document.getElementById('commentsModal'));
  myModal.show(myModal);

  let postId = this.id;
  console.log("POST ID:" + this.id);

  let url = `/api/comments/${this.id}`;
  let responce = await fetch(url);
  let data = await responce.json();
  console.log(data);
  let likeBtnClass = "";
  let dislikeBtnClass = "";


  let comments = document.querySelector("#comments");
  comments.innerHTML = `<h4> Comments </h4>`;
  for (let i = 0; i < data.length; i++) {
    comments.innerHTML += `<hr>
    <div class="model-comment">
    <p class="commenter-name">${data[i].fname}  ${data[i].lname} </p>
    <p class="comment-text">${data[i].text}</p>
    <a class="commentLikeBtn btn ${data[i].commentlike != undefined && data[i].commentlike == true ? 'btn-success' : 'btn-outline-success'} " id='cl${data[i].idComment}'>
      <span id='commentLikeCount${data[i].idComment}'>
        ${data[i].likes}
      </span>
      Likes
    </a> 
    <a class="commentDislikeBtn btn ${data[i].commentlike != undefined && data[i].commentlike == false ? 'btn-danger' : 'btn-outline-danger'}" id='cdl${data[i].idComment}'>
      <span id='commentDislikeCount${data[i].idComment}'>
      ${data[i].dislikes}
      </span>
      Dislikes
    </a>
    </div>`;
  }

  comments.innerHTML += `<input type="hidden" id="postId" value="${postId}">
  <hr><textarea id ="replyToPost" type="text" class="make-comment form-control"></textarea>`;
  // comments.innerHTML += `<button type="button" class="btn btn-dark">Reply</button>`;

  likeBtns = document.querySelectorAll(".commentLikeBtn");
  for (btn of likeBtns) {
    btn.addEventListener("click", async function() {
      let commentId = parseInt(this.id.replace(/[a-z]/gi, ""));
      let commentLikeAPI = `https://otterforum.cmarket.repl.co/api/comment?action=like&id=${commentId}`;
      let commentLikeResponse = await fetch(commentLikeAPI);
      let commentLikeData = await commentLikeResponse.json();
      console.log(commentLikeData);
      document.querySelector(`#commentLikeCount${commentId}`).innerHTML = `${commentLikeData.likes}`;
      document.querySelector(`#commentDislikeCount${commentId}`).innerHTML = `${commentLikeData.dislikes}`;
      likebtn = document.querySelector(`#cl${commentId}`);
      dislikebtn = document.querySelector(`#cdl${commentId}`);
      if (commentLikeData.commentlike == null) {
        likebtn.className = "commentLikeBtn btn btn-outline-success";
        dislikebtn.className = "commentDislike btn btn-outline-danger";
      } else if (commentLikeData.commentlike == true) {
        likebtn.className = "commentLikeBtn btn btn-success";
        dislikebtn.className = "commentDislikeBtn btn btn-outline-danger";
      } else {
        likebtn.className = "commentLikeBtn btn btn-outline-success";
        dislikebtn.className = "commentDislikeBtn btn btn-danger";
      }
    })
  }

  dislikeBtns = document.querySelectorAll(".commentDislikeBtn");
  for (btn of dislikeBtns) {
    btn.addEventListener("click", async function() {
      let commentId = parseInt(this.id.replace(/[a-z]/gi, ""));
      let commentLikeAPI = `https://otterforum.cmarket.repl.co/api/comment?action=dislike&id=${commentId}`;
      let commentLikeResponse = await fetch(commentLikeAPI);
      let commentLikeData = await commentLikeResponse.json();
      console.log(commentLikeData);
      document.querySelector(`#commentLikeCount${commentId}`).innerHTML = `${commentLikeData.likes}`;
      document.querySelector(`#commentDislikeCount${commentId}`).innerHTML = `${commentLikeData.dislikes}`;
      likebtn = document.querySelector(`#cl${commentId}`);
      dislikebtn = document.querySelector(`#cdl${commentId}`);
      if (commentLikeData.commentlike == null) {
        likebtn.className = "commentLikeBtn btn btn-outline-success";
        dislikebtn.className = "commentDislike btn btn-outline-danger";
      } else if (commentLikeData.commentlike == true) {
        likebtn.className = "commentLikeBtn btn btn-success";
        dislikebtn.className = "commentDislikeBtn btn btn-outline-danger";
      } else {
        likebtn.className = "commentLikeBtn btn btn-outline-success";
        dislikebtn.className = "commentDislikeBtn btn btn-danger";
      }
    })
  }
}

//use this to pass comment and info to href
function goTo() {  
  // var commenterId = document.getElementById("commenterId").value;  
  var postId = document.getElementById("postId").value;  
  var comment = document.getElementById("replyToPost").value;  
  console.log("COMMENT -> "+ comment + "POST ID: -> "+ postId);
  window.location.href = '/home/comment?comment='+comment + '&ogPost=' + postId;
}

async function categoryChosen() {
  console.log("CATEGORY CHANGED TO:" + document.querySelector(".category-select").value);

  let category = document.querySelector(".category-select").value;

  let url = `/api/post/${category}`;
  let response = await fetch(url);
  let data = await response.json();
  let postSection = document.querySelector("#post-section");
  postSection.innerHTML = "";
  console.log(data);
  for (post of data) {
    postSection.innerHTML += `<div class="container post-container">
      <h4>${post.title}</h4>
      <a href="/user/${post.username}">${post.username}</a>
      <p>${post.text}</p>
      
      <div class="post-info">
        <a class="post-likes btn ${post.postlike != undefined && post.postlike == true ? 'btn-success' : 'btn-outline-success'}" id="pl${post.idPost}">
          <span id="likecount${post.idPost}"><strong><u>${post.likes}</u></strong></span>
          Like 
        </a>
        <a class="post-dislikes btn ${post.postlike != undefined && post.postlike == false ? 'btn-danger' : 'btn-outline-danger'}" id="pdl${post.idPost}">
          <span id="dislikecount${post.idPost}"><strong><u>${post.dislikes}</u></strong></span>
          Dislike 
        </a> 
        
        <button id="${post.idPost}" class="comment-btn btn btn-dark btn-sm">${post.comments}comments</button>
      </div>
    </div>`;
  }
  await postLikeAPI();
  await commentLikeAPI();
}