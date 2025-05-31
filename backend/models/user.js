const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mylist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  watchedMovies: [
    {
      movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
      watchedTime: {
        type: Number,
        default: 0,
      },
      uploadTime: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
