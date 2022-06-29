import getMovieData from "./movieData.js";

init();

async function init() {
  // Menu button functionality
  const menuBtn = document.querySelector(".menu-btn");
  const sideNav = document.querySelector(".side-nav");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    sideNav.classList.toggle("side-nav__open");
  });

  // End of Menu button functionality

  // Get all movie data from the API
  const URL = "https://api.themoviedb.org/3/movie/upcoming";
  const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;
  let allUpcomingMoviesData, upcomingMoviesData;

  // Get the upcoming movies data & the Timestamp when the data was
  // last retrieved from the Movie DB API from the localStorage
  const retrievedData = localStorage.getItem("upcoming_movies");
  const lastQueryTime = +localStorage.getItem("upcoming_lastQueryTime"); // Prefix + is added to convert the value to Number
  const currentTime = Date.now();
  const timeDiffInSeconds = (currentTime - lastQueryTime) / 1000;
  try {
    // Fetch the movie data from the movie db API if there is no movie data in
    // localStorage or it has been 8 hours (28800 seconds) or more since the last query
    if (!retrievedData || timeDiffInSeconds >= 28800) {
      allUpcomingMoviesData = await getMovieData(URL, API_KEY);
      console.log(`Fetched Movie Data:`, allUpcomingMoviesData);

      // Extract only the title, release date, and poster image Url
      upcomingMoviesData = allUpcomingMoviesData.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          tagline: movie.overview,
          releaseDate: movie.release_date,
          popularity: movie.vote_average,
          posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        };
      });

      // Store the Timestamp for when the movie data was fetched to the local storage
      const queryTime = Date.now();
      localStorage.setItem("upcoming_lastQueryTime", queryTime);
      localStorage.setItem(
        "upcoming_movies",
        JSON.stringify(upcomingMoviesData)
      );
    } else {
      // Movie data is already in localStorage. Just need to parse it
      upcomingMoviesData = JSON.parse(retrievedData);
    }

    // Time to render the movies now
    renderMovieCards(upcomingMoviesData);
  } catch (error) {
    console.log(`Error occurred while fetching movie data: ${error.message}`);
    displayError("Unexpected error occurred while loading movie data");
  }
}

// This function parses the movies data and then renders each individual
// movie cards
function renderMovieCards(moviesData) {
  let fragment = new DocumentFragment();

  // If there is no movie data to display, display appropriate error
  if (!moviesData || moviesData.length === 0) {
    displayError("No movies to display!!!");
  } else {
    // Get a random index from 0 - 19
    const heroBanner = document.getElementById("heroBanner");
    const heroMovieIndex = Math.floor(Math.random() * 20);
    const heroMovie = moviesData[heroMovieIndex];

    const heroBannerTemplate = `
      <div class="hero-content-wrapper" id="heroContentWrapper">
        <h2 class="hero-banner__title">${heroMovie.title}</h2>
        <p class="hero-banner__tagline">${heroMovie.tagline}</p>
        <div class="hero-banner-link__wrapper">
          <a class="hero-banner__link" href="movie_details.html?movieId=${heroMovie.id}">View More</a>
        </div>
        <div class="hero-banner__overlay"></div>
      </div>
    `;
    const heroBannerContent = document
      .createRange()
      .createContextualFragment(heroBannerTemplate)
      .querySelector("#heroContentWrapper");

    heroBanner.style.backgroundImage = `url(${heroMovie.posterUrl})`;
    heroBanner.append(heroBannerContent);

    // Add the movie data to the page
    for (const movieData of moviesData) {
      // id, title, releaseDate & posterUrl are extracted using object destructuring
      const { id, title, releaseDate, popularity, posterUrl } = movieData;

      // Determine the ratingClass based on the value of popularity
      // Popularity < 4 ==> popular-low
      // Popularity between 4 and 7 (excluding 7) ==> popular-medium
      // Popularity >= 7 ==> popular-high
      let ratingClass = "movie-rating popular-low";
      if (popularity >= 7) ratingClass = "movie-rating popular-high";
      else if (popularity >= 4) ratingClass = "movie-rating popular-medium";

      const cardTemplate = `
      <div class="card" data-movie-id="${id}">
        <span class="${ratingClass}">
          <!-- Rating -->
          ${popularity}
        </span>
        <a class="movie-details-link" href="movie_details.html?movieId=${id}">
          <div class="movie-poster__wrapper">
            <img
              class="movie-poster"
              src="${posterUrl}"
              alt="${title}"
            />
          </div>
          <section class="movie-details">
            <h3 class="movie-title">${title}</h3>
            <p class="movie-release-date">${releaseDate}</p>
          </section>
        </a>
      </div>
    `;

      const card = document
        .createRange()
        .createContextualFragment(cardTemplate)
        .querySelector(".card");

      // Appends each card to the document fragment before adding the fragment
      // to the DOM
      fragment.append(card);
    }

    const cardsWrapper = document.getElementById("cardsWrapper");

    // Appends the document fragment containing all the cards
    // so that the page will be re-rendered only once
    cardsWrapper.append(fragment);
  }
}

function displayError(errorMessage) {
  const cardsWrapper = document.getElementById("cardsWrapper");

  const feedbackPara = document.createElement("p");
  feedbackPara.textContent = errorMessage;
  feedbackPara.className = "error-text";
  cardsWrapper.append(feedbackPara);
}
