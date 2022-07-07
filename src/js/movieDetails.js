// Details to be displayed from the fetch result from
// MovieDb API GET Movie Details endpoint:
// id, title, overview, poster_path, release_date, budget, revenue, runtime,
// tagline, vote_average
import { getSingleMovieDetails } from "./movieData.js";

init();

async function init() {
  const menuBtn = document.querySelector(".menu-btn");
  const sideNav = document.querySelector(".side-nav");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    sideNav.classList.toggle("side-nav__open");
  });

  const param = new URLSearchParams(window.location.search);
  const movieId = param.get("movieId");
  const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;

  try {
    const movieDetails = await getSingleMovieDetails(movieId, API_KEY);

    // Render the movie details
    movieDetailsHTML(movieDetails);
  } catch (error) {
    console.log(`Error occurred while fetching movie data: ${error.message}`);
    // displayError("Unexpected error occurred while loading movie data");
  }
}

function movieDetailsHTML(movieData) {
  const {
    id,
    title,
    overview,
    budget,
    revenue,
    runtime,
    tagline,
    vote_average: popularity,
    release_date: releaseDate,
    poster_path: posterRelativeUrl
  } = movieData;

  const posterUrl = `https://image.tmdb.org/t/p/w500${posterRelativeUrl}`;
  console.dir({
    id,
    title,
    overview,
    budget,
    revenue,
    runtime,
    tagline,
    popularity,
    releaseDate,
    posterUrl
  });

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

  document
    .getElementById("movieDetailsMain")
    .insertAdjacentHTML("afterbegin", template);
}
