const express = require("express");
const router = express.Router();
const Show = require("../models/Show");

router.get("/edit-show-list", async (req, res) => {
  try {
    const shows = await Show.find();
    res.render("editShowList", { shows: shows });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/shows/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    res.render("updateShowDetails", { show: show });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update-show/:id", async (req, res) => {
  try {
    await Show.findByIdAndUpdate(
      req.params.id,
      {
        genres: req.body.genres,
        overview: req.body.overview,
        posterPath: req.body.posterPath,
        backdropPath: req.body.backdropPath,
        releaseDate: req.body.releaseDate,
        name: req.body.name,
        ratings: req.body.ratings,
        seasons: req.body.seasons.map((season) => ({
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
      },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
