import getMovieData from "./movieData.js";

init();

async function init() {
    // Menu Button Functionality
    const menuBtn = document.querySelector(".menu-btn");
    const sideNav = document.querySelector(".side-nav");

    menuBtn.addEventListener("click",()=>{
        menuBtn.classList.toggle("open");
        sideNav.classList.toggle("side-nav__open");
    })

    // Gets all movie data from the API
    const URL = "https://api.themoviedb.org/3/movie/popular";
    const API_KEY = process.env.SILVERSCREEN_TMDB_API_KEY;
    let allPopularMoviesData, popularMovieSData;

    popularMoviesData = await getMovieData(URL, API_KEY);

    popularMovieSData = allPopularMoviesData.map((movie) => {
        return {
            id: movie.id,
            title: movie.title,
            tagline:movie.overview,
            releaseDate: movie.release_date,
            popularity: movie.vote_average,
            posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          };
    });

    // Add the movie data to the page 
    for(const movieData of popularMovieSData){
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

      document
      .getElementById("pop-cardsWrapper")
      .insertAdjacentHTML("beforeend", template);
    }


}

