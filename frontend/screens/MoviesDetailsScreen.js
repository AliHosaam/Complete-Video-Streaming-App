import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import MovieDetails from "../components/MovieDetails";
import MovieMoreDetails from "../components/MovieMoreDetails";
import RelatedMovies from "../components/RelatedMovies";
import { useNavigation } from "@react-navigation/native";

export default function MoviesDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { movie } = route.params;

  const formatToUST = (amount) => {
    return `$${amount.toLocaleString("en-US")}`;
  };

  const handleVideoPlayer = (downloadLink, movieId, movieName) => {
    navigation.navigate("MoviesVideoPlayer", {
      movieLink: downloadLink,
      movieId: movieId,
      movieName: movieName,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <MovieDetails movie={movie} handleVideoPlayer={handleVideoPlayer} />

        <MovieMoreDetails
          budget={movie.budget}
          productionCompanies={movie.productionCompanies}
          revenue={movie.revenue}
          watchProviders={movie.watchProviders}
          formatToUST={formatToUST}
        />

        <View style={styles.divider} />

        <RelatedMovies movieId={movie._id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  divider: {
    height: 0.9,
    backgroundColor: "#333",
    marginTop: 5,
    marginHorizontal: 50,
  },
});
