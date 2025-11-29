import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { moviesListAPI } from "../api/moviesListAPI";
import MovieBanner from "../components/MovieBanner";
import MylistMovies from "../components/MylistMovies";
import { myListAPI } from "../api/myListAPI";
import MovieCards from "../components/MovieCards";
import BlankComponent from "../components/BlankComponent";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen({ route }) {
  const navigation = useNavigation();

  const [moviesList, setMoviesList] = useState([]);
  const [myList, setMyList] = useState(route.params.mylist);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const moviesListApiCall = async () => {
      const movies = await moviesListAPI();
      setMoviesList(movies);
      setIsLoading(false);
    };

    moviesListApiCall();
  }, []);

  useEffect(() => {
    const updateMyList = async () => {
      const updatedMyList = await myListAPI();
      setMyList(updatedMyList.moviesInMyList);
    };

    updateMyList();
  }, []);

  const updateMylist = (newList) => {
    setMyList(newList);
  };

  const handleBanner = (movie) => {
    navigation.navigate("MoviesDetailsScreen", {
      movie: movie,
    });
  };

  const posterPlayButton = (movieId, movieLink, movieName) => {
    navigation.navigate("MoviesVideoPlayer", {
      movieId: movieId,
      movieLink: movieLink,
      movieName: movieName,
    });
  };

  const posterInfoButton = (movie) => {
    navigation.navigate("MoviesDetailsScreen", {
      movie: movie,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <MovieBanner
          moviesList={moviesList}
          mylist={myList}
          handleBanner={handleBanner}
          posterPlayButton={posterPlayButton}
          posterInfoButton={posterInfoButton}
          updateMylist={updateMylist}
          isLoading={isLoading}
        />

        <View style={styles.subContainer}>
          {myList.length != 0 && (
            <MylistMovies
              label="My List"
              mylist={myList}
              handleBanner={handleBanner}
            />
          )}
          <MovieCards
            handleBanner={handleBanner}
            genreID={35}
            label="Comedy Movies"
          />
          <MovieCards
            handleBanner={handleBanner}
            genreID={18}
            label="Drama Movies"
          />
          <MovieCards
            handleBanner={handleBanner}
            genreID={14}
            label="Fantasy Movies"
          />
          <MovieCards
            handleBanner={handleBanner}
            genreID={878}
            label="Sci-Fi Movies"
          />
          <MovieCards
            handleBanner={handleBanner}
            genreID={28}
            label="Action Movies"
          />
          <MovieCards
            handleBanner={handleBanner}
            genreID="Netflix"
            label="Only on Netflix"
          />
          <BlankComponent />
        </View>
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
  subContainer: {
    paddingHorizontal: 15,
    gap: 10,
    marginTop: 20,
  },
});
