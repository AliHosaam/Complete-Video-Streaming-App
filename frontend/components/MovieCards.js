import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { moviesListAPI } from "../api/moviesListAPI";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Skeleton } from "moti/skeleton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function MovieCards({ genreID, label, handleBanner }) {
  const navigation = useNavigation();

  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesList = async () => {
      const movies = await moviesListAPI(genreID);
      setMoviesList(movies);
      setIsLoading(false);
    };

    fetchMoviesList();
  }, [genreID]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledMoviesList = shuffleArray(moviesList);

  const handleGenreDetails = () => {
    navigation.navigate("MoviesGenreDetailsScreen", {
      shuffledMoviesList: shuffledMoviesList,
      label: label,
    });
  };

  const renderMovieCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleBanner(item)}
        activeOpacity={0.8}
        style={styles.movieCardContainer}
      >
        <Image
          source={{ uri: item.posterPath }}
          style={styles.movieCardImage}
        />
      </TouchableOpacity>
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={handleGenreDetails}>
          <Ionicons name="arrow-forward" color="white" size={30} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={shuffledMoviesList.slice(0, 10)}
        keyExtractor={(item) => item._id}
        renderItem={renderMovieCard}
        windowSize={2}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 280,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
  },
  label: {
    color: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.5),
  },
  movieCardContainer: {
    marginRight: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  movieCardImage: {
    borderRadius: 10,
    width: 150,
    height: "100%",
  },
  skeletonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
});
