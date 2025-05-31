const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const isAdmin = req.body.isAdmin === true;
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username already exists.",
        existingUser,
      });
    }

    const user = await User.register(
      new User({ username: req.body.username, isAdmin }),
      req.body.password
    );
    passport.authenticate("local")(req, res, () => {
      res.json({ success: true, user });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, error: loginErr.message });
      }

      return res.json({ success: true, user });
    });
  })(req, res, next);
});

router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  } else {
    return res.json({ authenticated: false, user: null });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.json({ success: true });
  });
});

router.get("/admin/register", (req, res) => {
  res.render("adminRegister");
});

router.post("/admin/register", async (req, res) => {
  try {
    const secretCode = req.body.secretCode;
    if (secretCode !== "abcd1234") {
      return res.render("adminRegister", {
        errorMessage: "Invalid secret code",
      });
    }

    const isAdmin = true;
    await User.register(
      new User({ username: req.body.username, isAdmin }),
      req.body.password
    );

    passport.authenticate("local")(req, res, () => {
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/admin/login", (req, res) => {
  res.render("adminLogin");
});

router.post("/admin/login", async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!user) {
      return res.render("adminLogin", {
        errorMessage: "Authentication failed",
      });
    }

    if (!user.isAdmin) {
      return res.render("adminLogin", { errorMessage: "You are not an admin" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, error: loginErr.message });
      }

      res.redirect("/");
    });
  })(req, res, next);
});

router.get("/admin/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.redirect("/admin/login");
  });
});

module.exports = router;
