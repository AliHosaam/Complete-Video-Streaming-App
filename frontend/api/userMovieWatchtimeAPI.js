import { ipAddress } from "../constants";

export const updateWatchTime = async (watchedTime, movieId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      watchedTime,
    }),
  };

  let url = `${ipAddress}/update-watched-time/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the movie watch time api:", error);
  }
};

export const getAllWatchTimes = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/watched-movies`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the movie watch time api:", error);
  }
};

export const getWatchTime = async (movieId) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/watched-time/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the movie watch time api:", error);
  }
};

export const removeWatchedMovie = async (movieId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-watched-movie/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the movie watch time api:", error);
  }
};

export const removeAllWatchedMovie = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-all-watched-movies`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the movie watch time api:", error);
  }
};
