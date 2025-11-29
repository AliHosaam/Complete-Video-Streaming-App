const express = require("express");
const router = express.Router();
const isLoggedIn = require("../routes/isLoggedIn");
const Show = require("../models/Show");

router.post("/add-show-to-mylist/:showId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const showId = req.params.showId;

    user.showsMylist.push(showId);
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post(
  "/remove-show-from-mylist/:showId",
  isLoggedIn,
  async (req, res) => {
    try {
      const user = req.user;

      user.showsMylist = user.showsMylist.filter(
        (showId) => showId != req.params.showId
      );
      await user.save();
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

router.get("/showsMylist", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const showsInMyList = await Show.find({ _id: { $in: user.showsMylist } });
    res.json({ success: true, showsInMyList });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
