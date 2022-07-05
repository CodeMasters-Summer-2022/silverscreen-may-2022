// Details to be displayed from the fetch result from
// MovieDb API GET Movie Details endpoint:
// id, title, overview, poster_path, release_date, release_date, budget, revenue, runtime,
// tagline, vote_average
import getMovieData from "./movieData.js";

init();

async function init() {
    const menuBtn = document.querySelector(".menu-btn");
    const sideNav = document.querySelector(".side-nav");
  
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("open");
      sideNav.classList.toggle("side-nav__open");
    });

    const param = new URLSearchParams(window.location.search);
    movieID = param.get('movieId');

    const URL = `https://api.themoviedb.org/3/movie/${movieID}`;
    const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;
    let allMovieDetails, movieDetails;

    allMovieDetails = await fetch(getMovieData(URL, API_KEY));
    console.log(`Fetched Movie Data:`, allMovieDetails);

    try {
        movieDetails = allMovieDetails.map((movie) => {
            return {
                id: movie.id,
                title: movie.title,
                tagline: movie.overview,
                releaseDate: movie.release_date,
                popularity: movie.vote_average,
                posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            };
        });
    } catch(error) {
        console.log(`Error occurred while fetching movie data: ${error.message}`);
        // displayError("Unexpected error occurred while loading movie data");
    }

    console.log(movieDetails);

    movieDetailsHTML(movieDetails);
}

function movieDetailsHTML(moviesData) {
    let fragment = new DocumentFragment();

    for (const movieData of moviesData) {
        const {id, title, releaseDate, posterUrl } = movieData;

        const template = `
      <div class="movie-card" data-movie-id="${id}">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-poster-wrapper">
          <p class="movie-release-date">Released on: ${releaseDate}</p>
          <img class="movie-poster" src="${posterUrl}" alt="Poster of ${title}">
          <div class="movie-overlay">
            <a href="./movie-details?movieId=${id}">View More</a>
          </div>
        </div>
      </div>`;

      document.getElementById("movie-details-main").append(fragment);
    }
}