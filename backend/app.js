require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const hbs = require("hbs");

const checkcon = require("./routes/checkcon");

const dashboard = require("./routes/dashboard");
const authRoutes = require("./routes/authRoutes");

const addMovie = require("./routes/addMovie");
const updateMovie = require("./routes/updateMovie");
const myList = require("./routes/myList");
const watchedMovies = require("./routes/watchedMovie");
const deleteMovie = require("./routes/deleteMovie");
const getMovies = require("./routes/getMovies");

const addShow = require("./routes/addShow");
const updateShow = require("./routes/updateShow");
const showsMylist = require("./routes/showsMylist");
const watchedShows = require("./routes/watchedShow");
const deleteShow = require("./routes/deleteShow");
const getShows = require("./routes/getShows");

const User = require("./models/User");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const path = require("path");
const port = 5000;
const url = process.env.DATABASE_URL;

const app = express();

app.set("view engine", "hbs");

hbs.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "abcd1234",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: url,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", checkcon);

app.use("/", dashboard);
app.use("/", authRoutes);

app.use("/", addMovie);
app.use("/", updateMovie);
app.use("/", myList);
app.use("/", watchedMovies);
app.use("/", deleteMovie);
app.use("/", getMovies);

app.use("/", addShow);
app.use("/", updateShow);
app.use("/", showsMylist);
app.use("/", watchedShows);
app.use("/", deleteShow);
app.use("/", getShows);

app.use(express.json());
app.use(cors());

app.listen(port, (req, res) => {
  console.log(`Your server running on port...: ${port}`);
});

mongoose.set("strictQuery", true);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connection Established"))
  .catch((error) => console.log("MongoDB Connection Failed: ", error.message));
