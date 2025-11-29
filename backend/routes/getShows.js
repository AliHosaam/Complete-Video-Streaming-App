const express = require("express");
const router = express.Router();
const Show = require("../models/Show");

router.get("/getAllShows", async (req, res) => {
  try {
    const allShows = await Show.find();
    res.json(allShows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const getUniquesGenres = (allShows) => {
  const genreSet = new Set();

  allShows.forEach((show) => {
    show.genres.forEach((genre) => {
      genreSet.add(genre);
    });
  });

  const uniqueGenres = [...genreSet];

  return uniqueGenres;
};

router.get("/getAllGenres", async (req, res) => {
  try {
    const allShows = await Show.find();

    const uniqueGenres = getUniquesGenres(allShows);

    res.json(uniqueGenres);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/searchShows/:showName", async (req, res) => {
  try {
    const { showName } = req.params;
    const regex = new RegExp(showName, "i"); // Case-insensitive search

    const matchingShows = await Show.find({ name: { $regex: regex } });

    res.json(matchingShows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getSimilarShows/:showID", async (req, res) => {
  try {
    const { showID } = req.params;
    const selectedShow = await Show.findById(showID);

    if (!selectedShow) {
      return res.status(404).send("Show not found");
    }

    const similarShows = await Show.find({
      genres: { $in: selectedShow.genres },
      _id: { $ne: showID }, // Exclude the selected show itself
    });

    res.json(similarShows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/get-latest-watched-episodeId/:showId", async (req, res) => {
  try {
    const { showId } = req.params;
    const user = req.user;

    const watchedShows = user.watchedShows.filter(
      (show) => show.showId.toString() === showId
    );

    const latestEpisode = watchedShows.sort(
      (a, b) => b.uploadTime - a.uploadTime
    )[0];

    res.json({ episodeId: latestEpisode });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
