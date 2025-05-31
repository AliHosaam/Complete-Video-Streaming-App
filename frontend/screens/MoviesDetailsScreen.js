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

  const handleVideoPlayer = (downloadLink, movieId) => {
    navigation.navigate("MoviesVideoPlayer", {
      movieLink: downloadLink,
      movieId: movieId,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        bounces={false}
      >
        <MovieDetails movie={movie} handleVideoPlayer={handleVideoPlayer} />

        <View style={styles.firstDivider} />

        <MovieMoreDetails
          budget={movie.budget}
          productionCompanies={movie.productionCompanies}
          revenue={movie.revenue}
          watchProviders={movie.watchProviders}
          formatToUST={formatToUST}
        />

        <View style={styles.secondDivider} />

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
  firstDivider: {
    height: 0.5,
    backgroundColor: "#333",
    marginTop: 160,
    marginHorizontal: 50,
  },
  secondDivider: {
    height: 0.5,
    backgroundColor: "#333",
    marginTop: 5,
    marginHorizontal: 50,
  },
});
