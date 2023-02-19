const input = document.querySelector("input");
const card = document.querySelector(".card");
const button = document.querySelector("#button");
const cards = document.getElementById("card");
const id2 = document.getElementById("2");
const id1 = document.getElementById("1");
const descrip = document.getElementById("des");
const buttons = document.getElementById("buttons");

window.onload = () => {
  cards.classList.add("d-none");
  id2.classList.add("d-none");
  console.log("get", getCookie("STEP"));
  if (getCookie("STEP") == 2) {
    id1.classList.add("d-none");
    id2.classList.remove("d-none");
  }
  const displaydes = JSON.parse(window.localStorage.getItem("descriptions"));
  const { title, thumbnail, date, publisher, description } = displaydes;
  displaydescriptions(title, thumbnail, date, publisher, description);
  console.log("des", title);
};

const getValue = () => {
  return input.value;
};
const searchBook = () => {
  let query = getValue();
  query &&
    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12`
        );
        const datas = await response.json();
        console.log("data", datas.items);
        displayData(datas.items);
      } catch (err) {
        console.log("err", err);
      }
    }, 500);
};
const removeBook = data => {
  data
    ? document.getElementById("book").classList.add("d-none")
    : document.getElementById("book").classList.remove("d-none");
};
const displayData = data => {
  console.log("data", data);
  let html = "";
  removeBook(data);
  cards.classList.remove("d-none");
  setTimeout(() => {
    cards.classList.add("d-none");
    data.map((data, index) => {
      const image = data.volumeInfo.imageLinks.thumbnail
        ? data.volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/128x196?text=No+Image";
      const title = data.volumeInfo.title
        ? data.volumeInfo.title.slice(0, 34)
        : "Unknown";
      const date = data.volumeInfo.publishedDate
        ? data.volumeInfo.publishedDate
        : "Unknown";
      const publisher = data.volumeInfo.publisher
        ? data.volumeInfo.publisher
        : "Unknown";
      const id = data.id;
      html += `
              <section class="card-main">
              <div class="card-image">
              <figure>
              <img src=${image} />
              </figure>
              </div>
              <div class="card-description">
              <h3>${title}</h3>
              <h3>Published Date : <span>${date}</span></h3>
              <h3>Publisher : <span>${publisher}</span></h3>
              <div>
              <a class="search card-search"  data-id="${id}">
              Moreinfo
              <i
                class="fa fa-long-arrow-right"
                aria-hidden="true"
                style="margin: 0px 4px"
              ></i>
            </a>
              </div>
              </div>
              </section>
          `;
    });
    card.innerHTML = html;
  }, 500);
};

function detail(id) {
  console.log("url", id);
}
const displayDetails = async id => {
  const reponses = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}`
  );
  const data = await reponses.json();
  const title = data.volumeInfo.title;
  const thumbnail = data.volumeInfo.imageLinks.thumbnail
    ? data.volumeInfo.imageLinks.thumbnail
    : "https://via.placeholder.com/128x196?text=No+Image";
  const date = data.volumeInfo.publishedDate
    ? data.volumeInfo.publishedDate
    : "Unknown";
  const publisher = data.volumeInfo.publisher
    ? data.volumeInfo.publisher
    : "Unknown";
  const description = data.volumeInfo.description
    ? data.volumeInfo.description
    : "No info";
  console.log("data", data);
  const descriptions = {
    title,
    thumbnail,
    date,
    publisher,
    description,
  };
  window.localStorage.setItem("descriptions", JSON.stringify(descriptions));
  displaydescriptions(title, thumbnail, date, publisher, description);
};
const displaydescriptions = (
  title,
  thumbnail,
  date,
  publisher,
  description
) => {
  let html = "";
  html += `<section class="d-flex d-justify">
  <div class="image-section">
  <h2>${title}</h2>
  <div class="card-image">
  <figure>
  <img src=${thumbnail} />
  </figure>
  </div>
  <h3>Published Date : <span>${date}</span></h3>
  <h3>Publisher : <span>${publisher}</span></h3>
  </div>
  <div class="des-section">
  <p>${description}</p>
  </div>
</section>`;
  descrip.innerHTML = html;
};

card.addEventListener("click", e => {
  console.log("event", e.target.tagName);
  if (e.target.tagName === "A") {
    const id = e.target.getAttribute("data-id");
    id1.classList.add("d-none");
    id2.classList.remove("d-none");
    displayDetails(id);
    setCookieMinuts("STEP", 2, 9);
  }
});
function setCookieMinuts(name, value, minuts) {
  var d = new Date();
  d.setTime(d.getTime() + 60 * 1000 * minuts);
  document.cookie =
    name +
    "=" +
    value +
    ";path=/;expires=" +
    d.toGMTString() +
    ";SameSite=Strict";
}
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
buttons.addEventListener("click", () => {
  deleteAllCookies();
  id2.classList.add("d-none");
  id1.classList.remove("d-none");
});
input.addEventListener("keyup", searchBook);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchBook();
  }
});
