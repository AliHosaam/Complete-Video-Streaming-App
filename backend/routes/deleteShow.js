const express = require("express");
const router = express.Router();
const Show = require("../models/Show");
const User = require("../models/User");

router.get("/delete-show", async (req, res) => {
  try {
    const shows = await Show.find();
    res.render("deleteShow", { shows: shows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete-show/:id", async (req, res) => {
  try {
    await Show.findOneAndDelete({ _id: req.params.id });

    await User.updateMany({}, { $pull: { showsMylist: req.params.id } });
    await User.updateMany(
      {},
      { $pull: { watchedShows: { showId: req.params.id } } }
    );

    const shows = await Show.find();

    res.render("deleteShow", {
      shows,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
