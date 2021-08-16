document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:3000/";
  const showPanel = document.getElementById("show-panel");
  const currentUser = 1;

  function renderBookList() {
    const ul = document.getElementById("list");
    fetchBookLists().then((data) => {
      data.forEach((el) => {
        const li = document.createElement("li");
        li.innerText = el.title;
        li.setAttribute("data-id", el.id);
        ul.appendChild(li);
        li.addEventListener("click", () => {
          renderBook(el.id);
        });
      });
    });
  }
  function clearTags() {
    while (showPanel.firstChild) {
      showPanel.removeChild(showPanel.firstChild);
    }
  }

  function setAttributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  function renderBook(id) {
    fetchBook(id).then((data) => {
      clearTags();
      const bookImg = document.createElement("img");
      const title = document.createElement("h4");
      const subtitle = document.createElement("h4");
      const author = document.createElement("h4");
      const description = document.createElement("p");

      setAttributes(bookImg, {
        src: data[0].img_url,
        height: "200",
        width: "120",
      });
      title.innerHTML = `<b>${data[0].title}</b>`;
      subtitle.innerHTML = `<b>${data[0].subtitle}</b>`;
      author.innerHTML = `<b>${data[0].author}</b>`;
      description.innerText = data[0].description;

      showPanel.append(bookImg, title, subtitle, author, description);
      renderUserLike(data[0].users, data[0].id);
    });
  }

  function renderUserLike(users, bookID) {
    const userPanel = document.createElement("ul");
    const likeBtn = document.createElement("button");
    let like = false;
    if (users.length > 0) {
      users.forEach((el) => {
        const user = document.createElement("li");
        user.innerText = el.username;
        userPanel.appendChild(user);
      });
      const currentUserLike = users.find((user) => user.id === currentUser);
      if (currentUserLike !== undefined) {
        //current user already liked
        like = true;
        likeBtn.innerText = "UNLIKE";
      } else {
        like = false;
        likeBtn.innerText = "LIKE";
      }
    } else {
      //no user like
      like = false;
      likeBtn.innerText = "LIKE";
    }
    showPanel.append(userPanel, likeBtn);
    likeBtn.addEventListener("click", () => {
      if (like) {
        users = users.filter((user) => user.id !== currentUser);
        console.log("new user without currentUser: ",users);
      } else {
        users.push({
          id: 1,
          username: "pouros",
        });
        console.log("new user with currentUser: ",users);
      }
      fetchLikeFn(users, bookID).then((data) => {
        console.log("data:  ",data);
        renderBook(bookID);
      });
    });
  }

  //fetches

  function fetchLikeFn(users, id) {
    confObj = {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: "{ \"users\":"+JSON.stringify(users)+"}"
    }
    console.log("confObj: ",confObj);
    return fetch(baseURL+`books/${id}`,confObj).then((resp) => resp.json());
  }

  function fetchBook(id) {
    return fetch(baseURL + `books?id=${id}`).then((resp) => resp.json());
  }

  function fetchBookLists() {
    return fetch(baseURL + "books").then((resp) => resp.json());
  }

  renderBookList();
});
