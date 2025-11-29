import { ipAddress } from "../constants";

export const moviesListAPI = async (genreID) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = "";
  if (genreID) {
    url = `${ipAddress}/getMovies/${genreID}`;
  } else {
    url = `${ipAddress}/getMovies`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies list api:", error);
  }
};

export const getSimilarMovies = async (moviesID) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/getSimilarMovies/${moviesID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies list api:", error);
  }
};

export const getSearchedMovies = async (movieName) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/searchMovies/${movieName}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies list api:", error);
  }
};
