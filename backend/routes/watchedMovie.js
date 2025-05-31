const express = require("express");
const router = express.Router();
const isLoggedIn = require("../routes/isLoggedIn");
const Movie = require("../models/Movie");

router.post("/update-watched-time/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const { movieId } = req.params;
    const watchedTime = req.body.watchedTime; // Get the watched time from the request body

    const movieToUpdate = user.watchedMovies.find((item) =>
      item.movie.equals(movieId)
    );

    if (movieToUpdate) {
      movieToUpdate.watchedTime = watchedTime; // Update the watched time

      const movieDetails = await Movie.findById(movieId);

      if (movieDetails) {
        movieToUpdate.uploadTime = Date.now(); // Update the upload time
      }
    } else {
      const movieDetails = await Movie.findById(movieId);

      if (movieDetails) {
        user.watchedMovies.push({
          movie: movieId,
          watchedTime: watchedTime,
          uploadTime: Date.now(),
        });
      }
    }

    await user.save();
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating watched time:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/remove-watched-movie/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const movieIdToRemove = req.params.movieId;

    const movieIndexToRemove = user.watchedMovies.findIndex((item) =>
      item.movie.equals(movieIdToRemove)
    );

    if (movieIndexToRemove !== -1) {
      user.watchedMovies.splice(movieIndexToRemove, 1); // Remove the movie from the watched list
      await user.save(); // Save the updated user document
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
  } catch (error) {
    console.error("Error removing watched movie:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/remove-all-watched-movies", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    user.watchedMovies = []; // Clear the watched movies array
    await user.save(); // Save the updated user document
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error removing all watched movies:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/watched-time/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const { movieId } = req.params;

    const movieWatchedTime = user.watchedMovies.find((item) =>
      item.movie.equals(movieId)
    );

    if (movieWatchedTime) {
      return res.status(200).json({
        success: true,
        watchedTime: movieWatchedTime.watchedTime,
      });
    } else {
      return res.status(200).json({
        success: true,
        watchedTime: 0,
      });
    }
  } catch (error) {
    console.error("Error getting the watched time of a movie:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/watched-movies", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const watchedMovies = await Promise.all(
      user.watchedMovies.map(async ({ movie, watchedTime, uploadTime }) => {
        const movieDetails = await Movie.findById(movie);

        return {
          movie: movieDetails,
          watchedTime: watchedTime,
          uploadTime: uploadTime,
        };
      })
    );

    watchedMovies.sort((a, b) => {
      return b.uploadTime - a.uploadTime; // Sort by upload time in descending order
    });

    return res.status(200).json({ success: true, watchedMovies });
  } catch (error) {
    console.error("Error getting all the watched movies:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
