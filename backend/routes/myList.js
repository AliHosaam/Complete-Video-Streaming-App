const express = require("express");
const router = express.Router();
const isLoggedIn = require("../routes/isLoggedIn");
const Movie = require("../models/Movie");

router.post("/add-to-mylist/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const movieId = req.params.movieId;

    user.mylist.push(movieId);
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/remove-from-mylist/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;

    user.mylist = user.mylist.filter(
      (movieId) => movieId != req.params.movieId
    );
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/mylist", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const moviesInMyList = await Movie.find({ _id: { $in: user.mylist } });
    res.json({ success: true, moviesInMyList });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
