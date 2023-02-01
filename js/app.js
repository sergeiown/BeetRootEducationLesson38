const apiKey = "5b81342d";
const searchForm = document.querySelector("#search-form");
const resultsContainer = document.querySelector("#results");
const detailsContainer = document.querySelector("#details");
const modalOverlay = document.querySelector("#modal-overlay");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const type = document.querySelector("#type").value;
  let page = 1;

  const movies = await getMovies(title, type, page);
  displayResults(movies);
});

async function getMovies(title, type, page) {
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(
    title
  )}&type=${encodeURIComponent(type)}&page=${page}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    return data.Search;
  } else {
    return [];
  }
}

function displayResults(movies) {
  resultsContainer.innerHTML = "";

  if (movies.length === 0) {
    resultsContainer.innerHTML = `
        <h1>Movie not found!</h1>`;
    return;
  }

  for (const movie of movies) {
    const div = document.createElement("div");

    let realPoster;
    if (movie.Poster === "N/A") {
      realPoster = "./img/no_image.jpg";
    } else {
      realPoster = movie.Poster;
    }

    div.innerHTML = `
      <img src="${realPoster}" alt="Poster">
      <p>${movie.Title} (${movie.Year})</p>
      <button class="details-button" data-imdbid="${movie.imdbID}">details</button>
    `;
    resultsContainer.appendChild(div);
  }

  const detailsButtons = document.querySelectorAll(".details-button");
  for (const button of detailsButtons) {
    button.addEventListener("click", async (event) => {
      const imdbID = event.target.getAttribute("data-imdbid");
      const movie = await getMovieDetails(imdbID);
      displayDetails(movie);
    });
  }
}

async function getMovieDetails(imdbID) {
  const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
  return data;
}

function displayDetails(movie) {
  let realPoster;
  if (movie.Poster === "N/A") {
    realPoster = "./img/no_image.jpg";
  } else {
    realPoster = movie.Poster;
  }

  modalOverlay.style.display = "block";
  detailsContainer.style.display = "flex";

  detailsContainer.innerHTML = `
      <img src="${realPoster}" alt="Poster">
      <div class="details-wrapper">
      <h2>${movie.Title} (${movie.Year})</h2> 
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Runtime:</strong> ${movie.Runtime}</p>
      <p><strong>imdbRating:</strong> ${movie.imdbRating}</p>
      <button class="close-button">close</button>
      </div>`;

  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", (event) => {
    detailsContainer.innerHTML = "";
    detailsContainer.style.display = "none";
    modalOverlay.style.display = "none";
  });
}
