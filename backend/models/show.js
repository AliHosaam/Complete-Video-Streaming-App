const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  name: String,
  overview: String,
  genres: [String],
  backdropPath: String,
  posterPath: String,
  releaseDate: Date,
  ratings: Number,
  seasons: [
    {
      season_number: Number,
      episodes: [
        {
          episode_number: Number,
          name: String,
          runtime: Number,
          overview: String,
          posterPath: String,
          downloadLink: String,
        },
      ],
    },
  ],
});

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
