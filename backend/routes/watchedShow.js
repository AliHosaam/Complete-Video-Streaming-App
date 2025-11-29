const express = require("express");
const router = express.Router();
const isLoggedIn = require("../routes/isLoggedIn");
const Show = require("../models/Show");

router.post(
  "/update-shows-watched-time/:episodeId",
  isLoggedIn,
  async (req, res) => {
    try {
      const user = req.user;
      const episodeId = req.params.episodeId;
      const watchedTime = req.body.watchedTime;
      const showId = req.body.showId;

      const episodeToUpdate = user.watchedShows.find((item) =>
        item.episode.equals(episodeId)
      );

      if (episodeToUpdate) {
        episodeToUpdate.watchedTime = watchedTime;
        episodeToUpdate.uploadTime = Date.now();
      } else {
        user.watchedShows.push({
          episode: episodeId,
          watchedTime,
          showId: showId,
          uploadTime: Date.now(),
        });
      }

      await user.save();
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error("Error updating shows watched time:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.post("/remove-watched-show/:showId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const showIdToRemove = req.params.showId;

    const originalLength = user.watchedShows.length;
    user.watchedShows = user.watchedShows.filter(
      (item) => !item.showId.equals(showIdToRemove)
    );

    if (user.watchedShows.length < originalLength) {
      await user.save();
      return res.status(200).json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Show not found in watched list" });
    }
  } catch (error) {
    console.error("Error removing watched show:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/remove-all-watched-shows", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    user.watchedShows = []; // Clear the watched shows array
    await user.save(); // Save the updated user document
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error removing all watched shows:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get-show-watchtime/:episodeId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const { episodeId } = req.params;

    const episodeWatchedTime = user.watchedShows.find((item) =>
      item.episode.equals(episodeId)
    );

    if (episodeWatchedTime) {
      return res.status(200).json({
        success: true,
        watchedTime: episodeWatchedTime.watchedTime,
      });
    } else {
      return res.status(200).json({
        success: true,
        watchedTime: 0,
      });
    }
  } catch (error) {
    console.error("Error getting the watched time of an episode:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/watched-shows", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;

    const uniqueShowIds = [
      ...new Set(user.watchedShows.map((item) => item.showId.toString())),
    ];

    const watchedShows = await Promise.all(
      uniqueShowIds.map(async (showId) => {
        const showDetails = await Show.findById(showId);
        return {
          show: showDetails,
        };
      })
    );

    watchedShows.sort((a, b) => {
      return b.uploadTime - a.uploadTime;
    });

    return res.status(200).json({ success: true, watchedShows });
  } catch (error) {
    console.error("Error getting all the watched shows:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/episode-info/:episodeId", isLoggedIn, async (req, res) => {
  try {
    const { episodeId } = req.params;
    const shows = await Show.find();

    let seasonArray = null;
    let showId = null;

    for (const show of shows) {
      for (const season of show.seasons) {
        const foundEpisode = season.episodes.find(
          (ep) => ep._id.toString() === episodeId.toString()
        );

        if (foundEpisode) {
          seasonArray = season.episodes;
          showId = show._id;
          break;
        }
      }

      if (seasonArray) {
        break;
      }
    }

    if (seasonArray) {
      return res.status(200).json({ success: true, seasonArray, showId });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Episode not found" });
    }
  } catch (error) {
    console.error("Error getting episode info:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
