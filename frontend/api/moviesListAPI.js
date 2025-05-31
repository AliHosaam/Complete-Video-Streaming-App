export const moviesListAPI = async (genreID) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  let url = "";
  if (genreID) {
    url = `http://192.168.1.5:5000/getMovies/${genreID}`;
  } else {
    url = "http://192.168.1.5:5000/getMovies";
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

  let url = `http://192.168.1.5:5000/getSimilarMovies/${moviesID}`;

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

  let url = `http://192.168.1.5:5000/searchMovies/${movieName}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies list api:", error);
  }
};
