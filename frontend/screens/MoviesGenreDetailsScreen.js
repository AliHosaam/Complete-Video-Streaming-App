import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BlankComponent from "../components/BlankComponent";
import { useNavigation } from "@react-navigation/native";
import MovieSection from "../components/MovieSection";

const MoviesGenreDetailsScreen = ({ route }) => {
  const navigation = useNavigation();

  const { shuffledMoviesList, label } = route.params;

  const handleMoviesSection = ({ item }) => {
    return (
      <View>
        <MovieSection movie={item} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.subContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <FlatList
        data={shuffledMoviesList}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={handleMoviesSection}
      />

      <BlankComponent />
    </View>
  );
};

export default MoviesGenreDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  subContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    gap: 10,
    marginTop: 100,
    alignItems: "center",
  },
  labelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
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
