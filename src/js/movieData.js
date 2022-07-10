/* 
  This module uses the provided URL and API Key to fetch the data from The Movie Database API
  Author: Deepak Joy Jose
  Last Modified: 2022/05/14
*/

async function getMovieData(url, apiKey) {
  try {
    // Ex: fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=YOUR_API_KEY")
    const response = await fetch(`${url}?api_key=${apiKey}`);
    const data = await response.json();

    // Only the results property from the data is being returned
    // since the information we need is under this property
    return data.results;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSingleMovieDetails(movieId, apiKey) {
  try {
    // Ex: fetch("https://api.themoviedb.org/3/movie/{movie_id}api_key=YOUR_API_KEY")
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    );
    const data = await response.json();

    // Only the results property from the data is being returned
    // since the information we need is under this property
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default getMovieData;
