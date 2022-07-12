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
    let allPopularMoviesData, popularMoviesData;

    // Get the upcoming movies data & the Timestamp when the data was
    // last retrieved from the Movie DB API from the localStorage
    const popRetrievedData = localStorage.getItem("popular_movies");
    const popLastQueryTime = +localStorage.getItem("popular_lastQueryTime");
    const popCurrentTime = Date.now();
    const popTimeDiffInSeconds = (popCurrentTime - popLastQueryTime) / 1000;
    try {
        // Fetch the movie data from the movie db API if there is no movie data in
        // localStorage or it has been 8 hours (28800 seconds) or more since the last query

        if (!popRetrievedData || popTimeDiffInSeconds >= 28800) {
            allPopularMoviesData = await getMovieData(URL, API_KEY);
            console.log(`Fetched Movie Data:`, allPopularMoviesData);

            // Extract only the title, release date, and poster image Url
            popularMoviesData = allPopularMoviesData.map((movie) => {
                return {
                    id: movie.id,
                    title: movie.title,
                    tagline: movie.overview,
                    releaseDate: movie.release_date,
                    popularity: movie.vote_average,
                    posterUrl: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                };
            });

            // Store the Timestamp for when the movie data was fetched to the local storage
            const popQueryTime = Date.now();
            localStorage.setItem("popular_lastQueryTime", popQueryTime);
            localStorage.setItem(
                "popular_movies",
                JSON.stringify(popularMoviesData)
            );
        } else {
            // Movie data is already in localStorage. Just need to parse it
            popularMoviesData = JSON.parse(popRetrievedData);
        }

        // Time to render the movies now
        renderMovieCardsPop(popularMoviesData);
    } catch (error) {
        console.log(
            `Error occurred while fetching movie data: ${error.message}`
        );
        displayError("Unexpected error occurred while loading movie data");
    }
}

// This function parses the movies data and then renders each individual
// Movie Hero Banner
function renderMovieCardsPop(moviesData) {
    // If there is no movie data to display, display appropriate error
    if (!moviesData || moviesData.length === 0) {
        displayError("No movies to display!!!");
    } else {
        // Get a random index from 0 - 19

        const popHeroBanner = document.getElementById("pop-heroBanner");
        const popHeroMovieIndex = Math.floor(Math.random() * 20);
        const popHeroMovie = moviesData[popHeroMovieIndex];

        const popHeroBannerTemplate = ` 
            <div class = "pop-hero-content-wrapper" id="popHeroContentWrapper" >
                <h2 class="pop-hero__title" >${popHeroMovie.title} </h2>
                <p class="pop-hero__tagline" >${popHeroMovie.tagline} </p>
                <div class="pop-hero__wrapper" >
                     <a class="pop-hero__link" href="movie_details.html?movieId=${popHeroMovie.id}" > View More</a>
                </div>
                <div class="pop-hero__overlay"></div>
            </div>
        `;
     
        const popHeroBannerContent = document
            .createRange()
            .createContextualFragment(popHeroBannerTemplate)
            .querySelector("#popHeroContentWrapper");

        popHeroBanner.style.backgroundImage = `url(${popHeroMovie.posterUrl})`;
        popHeroBanner.append(popHeroBannerContent);

        // Add the movie data to the page
        let fragment = new DocumentFragment();

        for (const movieData of moviesData) {
            const { id, title, tagline, releaseDate, posterUrl, popularity } =
                movieData;

            // Determine the ratingClass based on the value of popularity
            // Popularity < 4 ==> popular-low
            //pularity between 4 and 7 (excluding 7) ==> popular-medium
            // Popularity >= 7 ==> popular-high
            let ratingClass = "pop-movie-rating pop-popular-low";
            if (popularity >= 7)
                ratingClass = "pop-movie-rating pop-popular-high";
            else if (popularity >= 4)
                ratingClass = "pop-movie-rating pop-popular-medium";

            const template = `
            <div class="pop-card" data-movie-id="${id}">
              <span class="${ratingClass}">${popularity}</span>
              <a class="pop-movie-details-link" href="movie_details.html?movieId=${id}">
             <div class="pop-poster"> 
              <img class="pop-movie-poster" src="${posterUrl}" alt="${title}"/> 
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
}

function displayError(errorMessage) {
    const popCardsWrapper = document.getElementById("popCardsWrapper");

    const feedbackPara = document.createElement("p");
    feedbackPara.textContent = errorMessage;
    feedbackPara.className = "error-text";
    popCardsWrapper.append(feedbackPara);
}
