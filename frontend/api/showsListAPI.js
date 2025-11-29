import { ipAddress } from "../constants";

export const showsListAPI = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/getAllShows`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows list api:", error);
  }
};

export const getAllGenres = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/getAllGenres`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows list api:", error);
  }
};

export const getAllEpisodesList = async (episodeId) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/episode-info/${episodeId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows list api:", error);
  }
};

export const getSimilarShows = async (showID) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/getSimilarShows/${showID}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows list api:", error);
  }
};

export const getSearchedShows = async (showName) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/searchShows/${showName}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows list api:", error);
  }
};
