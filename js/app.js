const apiKey = '5b81342d';
let realPoster;
const searchForm = document.querySelector('#search-form');
const resultsContainer = document.querySelector('#results');
const detailsContainer = document.querySelector('#details');
const paginationContainer = document.querySelector('#pagination');
const modalOverlay = document.querySelector('#modal-overlay');

/* waiting for user actions with the form */
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    paginationContainer.style.display = 'none'; /* prevent pagination with no search result */

    const title = document.querySelector('#title').value;
    const type = document.querySelector('#type').value;
    let page = 1;

    const movies = await getMovies(title, type, page);
    displayResults(movies);
});

/* waiting for response with the movie data of the specified page */
async function getMovies(title, type, page) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&type=${encodeURIComponent(
        type
    )}&page=${page}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    const totalResults = data.totalResults;

    console.log(data);

    if (data.Response === 'True') {
        displayPagination(totalResults, title, type, page);

        return data.Search;
    } else {
        return [];
    }
}

/* displaying number of pages and controls */
function displayPagination(totalResults, title, type, page) {
    let currentPage = page;
    let totalPages = Math.min(100, Math.ceil(totalResults / 10));

    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = `
      <button class="previous-button">previous page</button>    
      <p>Page ${currentPage} of ${totalPages}</p>
      <button class="next-button">next page</button>
  `;

    const previousButton = document.querySelector('.previous-button');
    const nextButton = document.querySelector('.next-button');

    if (currentPage === 1) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
        previousButton.addEventListener('click', async (event) => {
            currentPage--;

            document.querySelector('#search-form').scrollIntoView({
                behavior: 'smooth',
            }); /* focus on the top of the page */

            const movies = await getMovies(title, type, currentPage);
            displayResults(movies);
        });
    }

    if (currentPage === 100 || currentPage === totalPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;

        nextButton.addEventListener('click', async (event) => {
            currentPage++;

            document.querySelector('#search-form').scrollIntoView({
                behavior: 'smooth',
            }); /* focus on the top of the page */

            const movies = await getMovies(title, type, currentPage);
            displayResults(movies);
        });
    }

    console.log(`totalResults: ${totalResults}`);
    console.log(`currentPage: ${page}`);
    console.log(`totalPages: ${totalPages}`);
}

/* displaying movie data and buttons for details */
function displayResults(movies) {
    resultsContainer.innerHTML = '';

    if (movies.length === 0) {
        resultsContainer.innerHTML = `<h1>Movie not found!</h1>`;
        return;
    }

    for (const movie of movies) {
        const div = document.createElement('div');

        realPoster = movie.Poster === 'N/A' ? (realPoster = './img/no_image.jpg') : (realPoster = movie.Poster);

        div.innerHTML = `
      <img src="${realPoster}" alt="Poster">
      <p>${movie.Title} (${movie.Year})</p>
      <button class="details-button" data-imdbid="${movie.imdbID}">details</button>
    `;
        resultsContainer.appendChild(div);
    }

    const detailsButtons = document.querySelectorAll('.details-button');
    for (const button of detailsButtons) {
        button.addEventListener('click', async (event) => {
            const imdbID = event.target.getAttribute('data-imdbid');
            const movie = await getMovieDetails(imdbID);
            displayDetails(movie);
        });
    }
}

/* waiting for response with the data of a specific movie by id */
async function getMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    return data;
}

/* displaying specific movie and close-button */
function displayDetails(movie) {
    realPoster = movie.Poster === 'N/A' ? (realPoster = './img/no_image.jpg') : (realPoster = movie.Poster);

    modalOverlay.style.display = 'block';
    detailsContainer.style.display = 'flex';

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

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', (event) => {
        detailsContainer.innerHTML = '';
        detailsContainer.style.display = 'none';
        modalOverlay.style.display = 'none';
    });
}
