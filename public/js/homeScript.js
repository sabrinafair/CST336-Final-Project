//Event Listeners
console.log("home scripts running");
document.querySelector(".category-select").addEventListener("change", categoryChosen);

commentButtons = document.querySelectorAll(".comment-btn");
for (commentButton of commentButtons) {
  commentButton.addEventListener("click", getComments);
}

async function getComments() {
  var myModal = new bootstrap.Modal(document.getElementById('commentsModal'));
  myModal.show(myModal);

  console.log("POST ID:" + this.id);

  let url = `/api/comments/${this.id}`;
  let responce = await fetch(url);
  let data = await responce.json();
  console.log(data);

  let comments = document.querySelector("#comments");
  comments.innerHTML = `<h4> Comments </h4><form action="/home">`;
  for (let i = 0; i < data.length; i++) {
    comments.innerHTML += `<hr><div class="model-comment"> <p class="commenter-name">${data[i].fname}  ${data[i].lname} </p>
    <p class="comment-text">${data[i].text}</p>
    <p class="likes-dislikes">${data[i].likes} Likes ${data[i].dislikes} Dislikes</p></div>`;
  }

  comments.innerHTML += `<textarea type="text" class="make-comment form-control"></textarea>`;

  comments.innerHTML += `<button type="button" class="btn btn-dark">Reply</button></form>`;
}

async function categoryChosen() {
  console.log("CATEGORY CHANGED TO:" + document.querySelector(".category-select").value);

  let category = document.querySelector(".category-select").value;

  // let url = `/api/category/${category}`;
  // let responce = await fetch(url);
  // let data = await responce.json();
  // console.log(data);


}