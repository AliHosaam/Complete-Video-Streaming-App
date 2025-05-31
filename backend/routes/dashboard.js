const express = require("express");
const router = express.Router();

const isAdminAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  return res.redirect("/admin/login");
};

router.get("/", isAdminAuthenticated, (req, res) => {
  res.render("dashboard");
});

router.get("/addMovieRoute", isAdminAuthenticated, (req, res) => {
  res.render("addMovieList");
});

router.get("/updateMovieRoute", isAdminAuthenticated, (req, res) => {
  res.redirect("/edit-movie-list");
});

router.get("/deleteMovieRoute", isAdminAuthenticated, (req, res) => {
  res.redirect("/delete-movie");
});

module.exports = router;
