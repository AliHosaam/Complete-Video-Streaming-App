export const addMovieToList = async (movieId) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const url = `http://192.168.1.5:5000/add-to-mylist/${movieId}`;

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

  const url = `http://192.168.1.5:5000/remove-from-mylist/${movieId}`;

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

  const url = "http://192.168.1.5:5000/mylist";

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching my list api:", error);
  }
};
