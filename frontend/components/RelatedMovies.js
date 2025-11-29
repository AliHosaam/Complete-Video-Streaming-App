import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSimilarMovies } from "../api/moviesListAPI";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";

export default function RelatedMovies({ movieId }) {
  const navigation = useNavigation();
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        const similarMovies = await getSimilarMovies(movieId);
        setRelatedMovies(similarMovies);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching similar movies:", error);
      }
    };

    fetchSimilarMovies();
  }, [movieId]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledRelatedMovies = shuffleArray(relatedMovies);

  const handleMovieDetails = (movie) => {
    navigation.push("MoviesDetailsScreen", {
      movie: movie,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Skeleton for label */}
        <Skeleton
          width={80}
          height={20}
          radius="round"
          colorMode="dark"
          transition={{ type: "timing" }}
        />

        {/* Skeletons for poster list */}
        <View style={styles.skeletonRow}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              width={150}
              height={210}
              radius={6}
              colorMode="dark"
              transition={{ type: "timing" }}
            />
          ))}
        </View>
      </View>
    );
  }

  const renderSimilarMovies = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleMovieDetails(item)}
        activeOpacity={0.8}
        style={styles.similarMoviesContainer}
      >
        <Image
          source={{ uri: item.posterPath }}
          style={styles.similarMoviesImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.relatedMoviesText}>Related</Text>

      <FlatList
        data={shuffledRelatedMovies.slice(0, 10)}
        keyExtractor={(item) => item._id}
        renderItem={renderSimilarMovies}
        windowSize={2}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 17,
    height: 280,
  },
  relatedMoviesText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  similarMoviesContainer: {
    marginRight: 12,
    paddingTop: 15,
  },
  similarMoviesImage: {
    borderRadius: 5,
    width: 150,
    height: "100%",
  },
  skeletonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
});
