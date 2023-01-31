const apiKey = "5b81342d";
const searchForm = document.querySelector("#search-form");
const resultsContainer = document.querySelector("#results");
const paginationContainer = document.querySelector("#pagination");
const detailsContainer = document.querySelector("#details");

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
    resultsContainer.innerHTML = "Movie not found!";
    return;
  }

  for (const movie of movies) {
    const div = document.createElement("div");
    div.innerHTML = `
      ${movie.Title} (${movie.Year})
      <button class="details-button" data-imdbid="${movie.imdbID}">Details</button>
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
  detailsContainer.innerHTML = `<h2>${movie.Title} (${movie.Year})</h2> <p><strong>Plot:</strong> ${movie.Plot}</p> <p><strong>Actors:</strong> ${movie.Actors}</p> <p><strong>Genre:</strong> ${movie.Genre}</p> <p><strong>Director:</strong> ${movie.Director}</p> `;
}
