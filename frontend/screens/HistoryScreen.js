import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAllWatchTimes,
  removeAllWatchedMovie,
  removeWatchedMovie,
} from "../api/userMovieWatchtimeAPI";
import MovieSection from "../components/MovieSection";
import BlankComponent from "../components/BlankComponent";

export default function HistoryScreen() {
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      setIsLoading(true);
      try {
        const response = await getAllWatchTimes();
        setWatchedMovies(response.watchedMovies);
      } catch (error) {
        console.error("Error fetching watched movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [reload]);

  const handleWatchedMoviesDeleteButton = async (movieId) => {
    try {
      const response = await removeWatchedMovie(movieId);
      setWatchedMovies(response);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error deleting watched movie:", error);
    }
  };

  const handleDeleteAllWatchedMovies = async () => {
    try {
      const response = await removeAllWatchedMovie();
      setWatchedMovies(response);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error deleting all watched movies:", error);
    }
  };

  if (watchedMovies.length <= 0) {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.labelText}>No History</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            History is empty. Try watching something!
          </Text>
        </View>
        <BlankComponent />
      </View>
    );
  }

  const handleMoviesSection = ({ item }) => {
    return (
      <View>
        <MovieSection
          movie={item.movie}
          isLoading={isLoading}
          showWatchedMoviesDeleteButton
          handleWatchedMoviesDeleteButton={handleWatchedMoviesDeleteButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.labelText}>All History</Text>

        <TouchableOpacity
          onPress={handleDeleteAllWatchedMovies}
          style={styles.deleteAllButton}
        >
          <Text style={styles.deleteAllText}>Delete all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={watchedMovies}
        keyExtractor={(item) => item.movie._id}
        showsVerticalScrollIndicator={false}
        renderItem={handleMoviesSection}
      />

      <BlankComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  subContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    gap: 10,
    marginTop: 100,
  },
  labelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  deleteAllButton: {
    backgroundColor: "#ff0000",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 190,
    marginBottom: 10,
  },
  deleteAllText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
