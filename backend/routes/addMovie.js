const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.post("/fetch-movie", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yjk2MWYwZjY3NjRmYjM4NGE2YzU5YjE0NDc1MzQ4ZCIsIm5iZiI6MTc0MzM0MjE4My42MTMsInN1YiI6IjY3ZTk0YTY3YWY3NTJhM2IyNGY2ZWUzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3fy2gJic9gzGDuqDMBRtlIQ-A0KmBqoUTkH34PD7rrs",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.results.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies with the given search term" });
    }

    res.render("addMovieList", { movieList: data.results });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

router.get("/addMovie/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yjk2MWYwZjY3NjRmYjM4NGE2YzU5YjE0NDc1MzQ4ZCIsIm5iZiI6MTc0MzM0MjE4My42MTMsInN1YiI6IjY3ZTk0YTY3YWY3NTJhM2IyNGY2ZWUzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3fy2gJic9gzGDuqDMBRtlIQ-A0KmBqoUTkH34PD7rrs",
      },
    };

    const response = await fetch(url, options);
    const movieDetails = await response.json();

    const watchProviderUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;
    const watchProviderResponse = await fetch(watchProviderUrl, options);
    const watchProviderData = await watchProviderResponse.json();

    const watchProviders = Object.keys(watchProviderData.results)
      .filter((country) => country === "US")
      .map((country) => {
        const countryData = watchProviderData.results[country];
        return {
          country: country,
          providerName: countryData.flatrate
            ? countryData.flatrate[0]?.provider_name
            : countryData.buy[0]?.provider_name,
        };
      });
    movieDetails.watchProviders = watchProviders;
    const genresIds = movieDetails.genres.map((genre) => genre.id);
    const genresNames = movieDetails.genres.map((genre) => genre.name);
    movieDetails.genreIds = genresIds;
    movieDetails.genres = genresNames;
    movieDetails.production_companies = movieDetails.production_companies.map(
      (company) => company.name
    );
    movieDetails.watchProviders = movieDetails.watchProviders.map(
      (provider) => provider.providerName
    );

    res.render("addMovie", { movieDetails });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

router.post("/add-movie-details", async (req, res) => {
  try {
    const movieDetails = req.body;
    const genresIds = movieDetails.genreIds.split(",").map((id) => Number(id));

    const existingMovie = await Movie.findOne({
      movieID: movieDetails.id,
    });

    if (existingMovie) {
      console.log(
        `Movie with ID ${movieDetails.id} already exists in the database. Skipping.`
      );
      return res.status(400).json({
        error: `Movie with ID ${movieDetails.id} already exists in the database. Skipping.`,
      });
    }

    const newMovie = new Movie({
      movieID: movieDetails.id,
      backdropPath:
        "https://image.tmdb.org/t/p/original" + movieDetails.backdrop_path,
      budget: Number(movieDetails.budget),
      originalTitle: movieDetails.original_title,
      title: movieDetails.title,
      overview: movieDetails.overview,
      releaseDate: movieDetails.release_date,
      runtime: movieDetails.runtime,
      genres: movieDetails.genres.split(","),
      productionCompanies: movieDetails.production_companies,
      watchProviders: movieDetails.watchProviders,
      genreIds: genresIds,
      ratings: Number(movieDetails.ratings),
      popularity: Number(movieDetails.popularity),
      posterPath:
        "https://image.tmdb.org/t/p/original" + movieDetails.poster_path,
      revenue: Number(movieDetails.revenue),
      runtime: Number(movieDetails.runtime),
      status: movieDetails.status,
      logos: "https://image.tmdb.org/t/p/original" + movieDetails.logos,
      downloadLink: movieDetails.downloadLink,
      runTime: Number(movieDetails.runtime),
    });

    await newMovie.save();
    res.render("addMovie", {
      successMessage: "Movie details has been submitted successfully!",
    });
  } catch (error) {
    console.error("Error saving movie details:", error);
    res.status(500).json({
      error: "Failed to save movie details. Please try again later.",
    });
  }
});

module.exports = router;
