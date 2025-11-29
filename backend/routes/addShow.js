require("dotenv").config();
const express = require("express");
const router = express.Router();
const Show = require("../models/Show");

router.post("/fetch-show", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const url = `https://api.themoviedb.org/3/search/tv?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_AUTH_KEY,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.results.length === 0) {
      return res
        .status(404)
        .json({ message: "No shows with the given search term" });
    }

    res.render("addShowList", { showsList: data.results });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch show details" });
  }
});

router.get("/addShow/:showId", async (req, res) => {
  const showId = req.params.showId;

  try {
    const url = `https://api.themoviedb.org/3/tv/${showId}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_AUTH_KEY,
      },
    };

    const response = await fetch(url, options);
    const showDetails = await response.json();

    const genreIds = showDetails.genres.map((genre) => genre.id);
    const genreNames = showDetails.genres.map((genre) => genre.name);
    showDetails.genreIds = genreIds;
    showDetails.genres = genreNames;

    showDetails.production_companies = showDetails.production_companies.map(
      (company) => company.name
    );

    const numOfSeasons = showDetails.number_of_seasons;
    showDetails.seasons = [];

    for (let i = 1; i <= numOfSeasons; i++) {
      const seasonUrl = `https://api.themoviedb.org/3/tv/${showId}/season/${i}?language=en-US`;
      const response = await fetch(seasonUrl, options);
      const seasonData = await response.json();
      const episodes = seasonData.episodes.map((episode) => ({
        episode_number: episode.episode_number,
        name: episode.name,
        runtime: episode.runtime,
        overview: episode.overview,
        poster: "https://image.tmdb.org/t/p/original" + episode.still_path,
        downloadLink: "",
      }));

      showDetails.seasons.push({
        season_number: seasonData.season_number,
        episodes: episodes,
      });
    }

    showDetails.seasons = showDetails.seasons.filter(
      (season) =>
        season.episodes &&
        season.episodes.length > 1 &&
        season.episodes[0].runtime !== null
    );

    const selectedShowDetails = {
      first_air_date: showDetails.first_air_date,
      genres: showDetails.genres,
      id: showDetails.id,
      name: showDetails.name,
      overview: showDetails.overview,
      poster_path:
        "https://image.tmdb.org/t/p/original" + showDetails.poster_path,
      backdrop_path:
        "https://image.tmdb.org/t/p/original" + showDetails.backdrop_path,
      vote_average: showDetails.vote_average,
      seasons: showDetails.seasons,
    };

    res.render("addShow", { showDetails: selectedShowDetails });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch show details" });
  }
});

router.post("/add-show-details", async (req, res) => {
  try {
    const showDetailsData = req.body;

    const existingShow = await Show.findOne({
      name: showDetailsData.showDetails.name,
    });

    if (existingShow) {
      console.log(
        `Show with name ${showDetailsData.showDetails.name} already exists in the database. Skipping.`
      );
      return res.json({ success: false });
    }

    const newShowDocument = new Show({
      genres: showDetailsData.showDetails.genres,
      overview: showDetailsData.showDetails.overview,
      posterPath: showDetailsData.showDetails.poster_path,
      backdropPath: showDetailsData.showDetails.backdrop_path,
      releaseDate: new Date(showDetailsData.showDetails.first_air_date),
      name: showDetailsData.showDetails.name,
      ratings: Number(showDetailsData.showDetails.vote_average),
      seasons: showDetailsData.seasons.map((season) => ({
        season_number: Number(season.season_number),
        episodes: season.episodes.map((episode) => ({
          episode_number: Number(episode.episode_number),
          name: episode.name,
          runtime: Number(episode.runtime),
          overview: episode.overview,
          posterPath: episode.poster,
          downloadLink: episode.downloadLink,
        })),
      })),
    });

    await newShowDocument.save();
    res.json({ success: true });
  } catch (error) {
    console.log("Error saving show:", error);
    return res.status(500).json({ error: "Failed to submit show details" });
  }
});

module.exports = router;
