// Details to be displayed from the fetch result from
// MovieDb API GET Movie Details endpoint:
// id, title, overview, poster_path, release_date, release_date, budget, revenue, runtime,
// tagline, vote_average

const param = new URLSearchParams(window.location.search);
movieID = param.get('movieId');
