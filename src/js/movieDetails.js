// Details to be displayed from the fetch result from
// MovieDb API GET Movie Details endpoint:
// id, title, overview, poster_path, release_date, release_date, budget, revenue, runtime,
// tagline, vote_average

function getMovieDetails(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const movieID = urlParams.get('movieId')
    console.log(movieID);
}