document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://localhost:3000/";
  const ul = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");
  const currentUser = 1;

  function renderBookList() {
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
      const title = document.createElement('h4');
      const subtitle = document.createElement('h4');
      const author = document.createElement('h4');
      const description = document.createElement('p');
      setAttributes(bookImg, {
        src: data[0].img_url,
        height: "200",
        width: "120"
      });
      title.innerHTML = `<b>${data[0].title}</b>`;
      subtitle.innerHTML = `<b>${data[0].subtitle}</b>`;
      author.innerHTML = `<b>${data[0].author}</b>`;
      description.innerText = data[0].description;
      
      showPanel.append(bookImg, title, subtitle, author, description);
    });
  }
  //fetches
  function fetchBook(id) {
    return fetch(baseURL + `books?id=${id}`).then((resp) => resp.json());
  }

  function fetchBookLists() {
    return fetch(baseURL + "books").then((resp) => resp.json());
  }

  renderBookList();
});
