"use strict";

async function fetchData() {
  // const response = await fetch(
  //   "http://www.omdbapi.com/?i=tt3896198&apikey=5b81342d"
  // );
  const response = await fetch(
    "http://www.omdbapi.com/?s=world&page=1&apikey=5b81342d"
  );

  const data = await response.json();
  return data;
}

async function main() {
  const data = await fetchData();
  showMovies(data);
  console.log(data);
}

main();

function showMovies(response) {
  const moviesResponse = response.Search;

  try {
    moviesResponse.forEach((movie) => {
      document.querySelector(".films").innerHTML += `
  <li>
      <p>Title: ${movie.Title}</p>
      <p>ID: ${movie.imdbID}</p><br>
  </li>`;
    });
  } catch {}
}
