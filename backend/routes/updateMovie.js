const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/edit-movie-list", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("editMovieList", { movies: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.render("updateMovieDetails", { movie: movie });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update-movie/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        movieID: Number(req.body.movieID),
        backdropPath: req.body.backdropPath,
        budget: Number(req.body.budget),
        genreIds: req.body.genreIds.split(",").map((id) => Number(id)),
        genres: req.body.genres.split(","),
        originalTitle: req.body.originalTitle,
        overview: req.body.overview,
        popularity: Number(req.body.popularity),
        ratings: Number(req.body.ratings),
        releaseDate: req.body.releaseDate,
        posterPath: req.body.posterPath,
        title: req.body.title,
        productionCompanies: req.body.productionCompanies,
        revenue: Number(req.body.revenue),
        runTime: Number(req.body.runtime),
        status: req.body.status,
        watchProviders: [req.body.watchProviders],
        logos: "https://image.tmdb.org/t/p/w500" + req.body.logos,
        downloadLink: req.body.downloadLink,
      },
      { new: true }
    );

    res.render("updateMovieDetails", {
      movie: updatedMovie,
      successMessage: "Movie updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
