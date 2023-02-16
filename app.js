const input = document.querySelector("input");
const card = document.querySelector(".card");
const button = document.querySelector("#button");
const section = document.getElementById("section");

window.onload = () => {
  let datos = JSON.parse(window.localStorage.getItem("datas"));
  search(datos);
};
const getValue = () => {
  return input.value;
};
const search = async datos => {
  let h5 = (document.createElement("h5").innerText = "loading...");
  card.innerHTML = h5;
  let value = getValue();
  let html = "";
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${
        value == "" ? "2" : value
      }&maxResults=12`
    );
    const data = await response.json();
    window.localStorage.setItem("datas", JSON.stringify(data));
    data
      ? document.getElementById("book").classList.add("d-none")
      : document.getElementById("book").classList.remove("d-none");
    let datas = data ? data : datos;
    console.log("datas", datas);
    datas.items.map((data, index) => {
      html += `
              <section class="card-main">
              <div class="card-image">
              <figure>
              <img src=${data.volumeInfo.imageLinks.thumbnail} />
              </figure>
              </div>
              <div class="card-description">
              <h3>${data.volumeInfo.title.slice(0, 34) ?? ""}</h3>
              <h3>Published Date : <span>${
                data.volumeInfo.publishedDate ?? ""
              }</span></h3>
              <h3>Publisher : <span>${
                data.volumeInfo.publisher ?? ""
              }</span></h3>
              <div>
              <a href="./search.html" class="search card-search">
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
  } catch (err) {
    console.log("error", err);
  }
};

button.addEventListener("click", search);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    search();
  }
});
