import { ipAddress } from "../constants";

export const updateWatchTime = async (watchedTime, showId, episodeId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      watchedTime,
      showId,
    }),
  };

  let url = `${ipAddress}/update-shows-watched-time/${episodeId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};

export const getLatestWatchedEpisodeID = async (showId) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/get-latest-watched-episodeId/${showId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};

export const getShowWatchTime = async (episodeId) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/get-show-watchtime/${episodeId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};

export const getAllWatchedShows = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/watched-shows`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};

export const removeWatchedShow = async (showId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-watched-show/${showId}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};

export const removeAllWatchedShow = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = `${ipAddress}/remove-all-watched-shows`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching the show watch time api:", error);
  }
};
