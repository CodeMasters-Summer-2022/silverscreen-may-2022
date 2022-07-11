// Add JS code to fetch data from https://api.themoviedb.org/3/movie/now_playing?api_key=<<api_key>>&language=en-US&page=1

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

  // Getting all movie data from the Api
  const URL = "https://api.themoviedb.org/3/movie/now_playing";
  const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;

  let allNowPlayingMoviesData, nowPlayingMoviesData;

  // Gets all movie data from the API
  allNowPlayingMoviesData = await getMovieData(URL, API_KEY);

  // Extract only the title, release date, and poster image Url
  nowPlayingMoviesData = allNowPlayingMoviesData.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
      tagline: movie.overview,
      releaseDate: movie.release_date,
      popularity: movie.vote_average,
      posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
    };
  });

  // Setting a random Movie from the Api as the hero section
  const randomMovie = Math.floor(Math.random() * 20);
  const nplHeroMovie = nowPlayingMoviesData[randomMovie];

  const nplHeroBannerTemplate = `
    <div class="npl-hero-content-wrapper" id = "nplHeroContentWrapper">
      <h2 class="npl-hero__title">${nplHeroMovie.title}</h2>
      <p class="npl-hero__tagline">${nplHeroMovie.tagline}</p>
      <div class="npl-hero__wrapper">
        <a class="npl-hero__link" href="movie_details.html?movieId=${nplHeroMovie.id}">View More</a>
      </div>
      <div class="npl-hero-banner__overlay"></div>
    </div>
  `;

  const nplHeroBanner = document.querySelector("#npl-heroBanner");

  const heroBannerContent = document
    .createRange()
    .createContextualFragment(nplHeroBannerTemplate)
    .querySelector("#nplHeroContentWrapper");

  // const nplHeroBanner = document.querySelector("#npl-hero");
  nplHeroBanner.style.backgroundImage = `url(${nplHeroMovie.posterUrl})`;
  nplHeroBanner.append(heroBannerContent);
  // nplHeroBanner.insertAdjacentHTML("beforeend", nplHeroMovieTemplate);

  // Adding the movie data to the page
  for (const movieData of nowPlayingMoviesData) {
    // id, title, releaseDate & posterUrl are extracted using object destructuring

    const { id, title, releaseDate, popularity, posterUrl } = movieData;

    // Determining the rating class based on the value of popularity
    // Popularity < 4 ==> popular-low
    // Popularity between 4 and 7 (excluding 7) ==> popular-medium
    // Popularity >= 7 ==> popular-high

    let ratingClass = "npl-movie-rating npl-popular-low";

    if (popularity >= 7) {
      ratingClass = "npl-movie-rating npl-popular-high";
    } else if (popularity > 4) {
      ratingClass = "npl-movie-rating npl-popular-medium";
    }

    const template = `
    <div class="npl-card" data-movie-id="${id}">
        <span class="${ratingClass}">${popularity}</span>
        <div class="npl-poster">
          <img
          class="npl-movie-poster"
          src="${posterUrl}" 
          alt="Poster of ${title}"
          />
        </div>
        <div class="npl-movieInfo">
          <h3 class="npl-movieInfo__title">${title}</h3>
          <p class="npl-movieInfo__date">${releaseDate}</p>
        </div>
      </div>
    `;

    // Parses the 'template' as HTML and inserts the resulting nodes into the DOM tree.
    document
      .querySelector(".npl-cardsWrapper")
      .insertAdjacentHTML("beforeend", template);
  }
}
