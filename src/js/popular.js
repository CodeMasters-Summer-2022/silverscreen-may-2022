import getMovieData from "./movieData.js";

init();

async function init() {
    // Menu Button Functionality
    const menuBtn = document.querySelector(".menu-btn");
    const sideNav = document.querySelector(".side-nav");

    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("open");
        sideNav.classList.toggle("side-nav__open");
    });

    // Gets all movie data from the API
    const URL = "https://api.themoviedb.org/3/movie/popular";
    const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;
    let allPopularMoviesData, popularMovieSData;

    allPopularMoviesData = await getMovieData(URL, API_KEY);

    popularMovieSData = allPopularMoviesData.map((movie) => {
        return {
            id: movie.id,
            title: movie.title,
            tagline: movie.overview,
            releaseDate: movie.release_date,
            popularity: movie.vote_average,
            posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        };
    });

    let fragment = new DocumentFragment();
    // Add the movie data to the page
    for (const movieData of popularMovieSData) {
        const { id, title, tagline, releaseDate, posterUrl, popularity } =
            movieData;

        let ratingClass = "pop-movie-rating pop-popular-low";
        if (popularity >= 7) ratingClass = "pop-movie-rating pop-popular-high";
        else if (popularity >= 4)
            ratingClass = "pop-movie-rating pop-popular-medium";

        const template = `

      <div class="pop-card" data-movie-id="${id}">
          <span class="${ratingClass}">${popularity}</span>
      <div class="pop-poster"> 
          <img src="${posterUrl}" alt="${title}"/> 
      </div>
      <div class="pop-movieInfo"> 
          <h3 class="pop-movieInfo__title">${title}</h3>
          <p class="pop-movieInfo__date">${releaseDate}</p>
      </div>
      </div>
      `;
      

        const card = document
            .createRange()
            .createContextualFragment(template)
            .querySelector(".pop-card");

        fragment.append(card);
    }
    document.getElementById("popCardsWrapper").append(fragment);
}
