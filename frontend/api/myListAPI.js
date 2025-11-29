import { ipAddress } from "../constants";

export const addMovieToList = async (movieId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/add-to-mylist/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};

export const removeMovieFromList = async (movieId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-from-mylist/${movieId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};

export const myListAPI = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/mylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};

export const showsMylist = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/showsMylist`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};

export const addShowToList = async (showId) => {
  const options = {
    method: "POST",
    headers: {
      contentType: "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/add-show-to-mylist/${showId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};

export const removeShowFromList = async (showId) => {
  const options = {
    method: "POST",
    headers: {
      contentType: "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-show-from-mylist/${showId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};
