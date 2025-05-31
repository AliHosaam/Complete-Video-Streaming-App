import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import formatRuntime from "../utils/formatRuntime";
import formatDate from "../utils/formatDate";

export default function MovieDetails({ movie, handleVideoPlayer }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, [1000]); // Simulate loading time
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Backdrop skeleton */}
        <Skeleton
          width={responsiveWidth(100)}
          height={responsiveHeight(20)}
          radius={0}
          colorMode="dark"
        />

        {/* Poster skeleton */}
        <View style={styles.posterSkeletonContainer}>
          <Skeleton
            width={responsiveWidth(30)}
            height={responsiveHeight(20)}
            radius={5}
            colorMode="dark"
          />
        </View>

        {/* Watch Now button skeleton */}
        <View style={styles.playButtonSkeletonContainer}>
          <Skeleton
            width={responsiveWidth(30)}
            height={responsiveHeight(4)}
            radius={responsiveWidth(1)}
            colorMode="dark"
          />
        </View>

        {/* Text skeletons */}
        <View style={styles.textSkeletonContainer}>
          <Skeleton width={responsiveWidth(40)} height={12} colorMode="dark" />
          <Skeleton
            width={responsiveWidth(20)}
            height={10}
            colorMode="dark"
            style={{ marginTop: 10 }}
          />
          <Skeleton
            width={responsiveWidth(35)}
            height={10}
            colorMode="dark"
            style={{ marginTop: 10 }}
          />
          <Skeleton
            width={responsiveWidth(25)}
            height={10}
            colorMode="dark"
            style={{ marginTop: 10 }}
          />
          <Skeleton
            width={responsiveWidth(15)}
            height={14}
            colorMode="dark"
            style={{ marginTop: 10 }}
          />
          <Skeleton
            width={responsiveWidth(50)}
            height={80}
            colorMode="dark"
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: movie.backdropPath }}
        style={styles.dropImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,1)"]}
          style={styles.linearGradient}
        />
        <View style={styles.movieDetailsContainer}>
          <Image
            source={{ uri: movie.posterPath }}
            style={styles.posterImage}
          />
          <TouchableOpacity
            onPress={() => handleVideoPlayer(movie.downloadLink, movie._id)}
            style={styles.playButton}
          >
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
          <Text style={styles.movieOriginalTitle}>{movie.originalTitle}</Text>
          <Text style={styles.movieRunTime}>
            {formatRuntime(movie.runTime)}
          </Text>
          <Text style={styles.movieGenres}>{movie.genres.join(", ")}</Text>
          <Text style={styles.movieReleaseDate}>
            {formatDate(movie.releaseDate)}
          </Text>
          <Text style={styles.PlotText}>Plot</Text>
          <Text style={styles.movieOverview}>{movie.overview}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: responsiveHeight(20),
    width: "100%",
  },
  dropImage: {
    width: responsiveWidth(100),
    height: "100%",
    justifyContent: "flex-end",
  },
  linearGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  movieDetailsContainer: {
    position: "absolute",
    height: responsiveHeight(25),
    width: "60%",
    top: 15,
  },
  textSkeletonContainer: {
    position: "absolute",
    top: 100,
    left: 155,
    gap: 10,
  },
  posterImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    left: 15,
    top: 70,
  },
  posterSkeletonContainer: {
    position: "absolute",
    bottom: 10,
    left: 15,
    top: 90,
    width: responsiveWidth(30),
    height: responsiveHeight(20),
  },
  playButton: {
    position: "absolute",
    backgroundColor: "#daa520",
    padding: 8,
    width: responsiveWidth(30),
    borderRadius: responsiveWidth(1),
    top: 265,
    left: 15,
  },
  playButtonSkeletonContainer: {
    position: "absolute",
    top: 285,
    left: 15,
    width: responsiveWidth(30),
  },
  playText: {
    color: "black",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  movieOriginalTitle: {
    color: "#fafafa",
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    left: 155,
    marginBottom: 130,
  },
  movieRunTime: {
    color: "grey",
    fontSize: 12,
    position: "absolute",
    bottom: 10,
    left: 155,
    top: 100,
    fontWeight: "bold",
  },
  movieGenres: {
    color: "grey",
    fontSize: 10,
    position: "absolute",
    bottom: 10,
    left: 155,
    top: 120,
    fontWeight: "bold",
  },
  movieReleaseDate: {
    color: "grey",
    fontSize: 10,
    position: "absolute",
    bottom: 10,
    left: 155,
    top: 140,
    fontWeight: "bold",
  },
  PlotText: {
    color: "grey",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    left: 155,
    top: 160,
  },
  movieOverview: {
    color: "grey",
    fontSize: 10,
    fontWeight: "bold",
    bottom: 10,
    left: 155,
    top: 180,
    lineHeight: 13,
  },
});
