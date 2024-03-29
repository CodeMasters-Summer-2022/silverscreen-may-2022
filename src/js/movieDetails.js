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
    displayError("Unexpected error occurred while loading movie data.");
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

  const date = new Date(releaseDate);
  const month = date.toLocaleString('default', { month: 'long' });
  const formatRelease = month + " " + date.getDate().toString() + ", " + date.getFullYear().toString();

  let ratingClass = "movie-rating popular-low";
  if (popularity >= 7) ratingClass = "movie-rating popular-high";
  else if (popularity >= 4) ratingClass = "movie-rating popular-medium";

  let totalRev = revenue;
  let formatRev = "$" + totalRev.toLocaleString();
  if (revenue === 0) formatRev = "-";

  let totalBudget = budget;
  let formatBudget = "$" + totalBudget.toLocaleString();
  if (budget === 0) formatBudget = "-";

  let formatTagline = tagline;
  if (tagline === "") formatTagline = "-";
  else formatTagline = "\"" + tagline + "\"";

  const template = `
      <div class="single-movie" data-movie-id="${id}">
        <h2 class="single-title">${title}</h2>
        <div class="single-movie-poster-wrapper">
          <img class="single-movie-poster" src="${posterUrl}" alt="Poster of ${title}">
            <div class="single-movie-popularity">
              <h3>POPULARITY</h3>
              <p class="${ratingClass}">${popularity}</p>
            </div>
            <div class="single-movie-release-date">
              <h3>RELEASE</h3>
              <p>${formatRelease}</p>
            </div>
            <div class="single-movie-budget">
              <h3>BUDGET</h3>
              <p>${formatBudget}</p>
            </div>
            <div class="single-movie-revenue">
              <h3>REVENUE</h3>
              <p">${formatRev}</p>
            </div>
            <div class="single-movie-runtime">
              <h3>RUNTIME</h3>
              <p>${runtime} mins</p>
            </div>
            <div class="single-movie-tagline">
              <h3>TAGLINE</h3>
              <i>${formatTagline}</i>
            </div>
            <div class="single-movie-overview">
              <h3>OVERVIEW</h3>
              <p>${overview}</p>
            </div>
        </div>

      </div>`;

  document
    .getElementById("movieDetailsMain")
    .insertAdjacentHTML("beforeend", template);
}

function displayError(errorMessage) {
  const movieError = document.getElementById("movieDetailsMain");
  const feedbackPara = document.createElement("p");
  feedbackPara.textContent = errorMessage;
  feedbackPara.className = "error-text";
  movieError.append(feedbackPara);
}
