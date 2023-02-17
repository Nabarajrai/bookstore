const input = document.querySelector("input");
const card = document.querySelector(".card");
const button = document.querySelector("#button");
const cards = document.getElementById("card");
const id2 = document.getElementById("2");

window.onload = () => {
  cards.classList.add("d-none");
  id2.classList.add("d-none");
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
              <a class="search card-search" onclick="detail(title)">
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

function detail(pub) {
  search();
  console.log("url", pub);
}
input.addEventListener("keyup", searchBook);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchBook();
  }
});
