import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import SearchInput from "../components/SearchInput";
import { getSearchedMovies, moviesListAPI } from "../api/moviesListAPI";
import MovieSection from "../components/MovieSection";
import BlankComponent from "../components/BlankComponent";

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        if (searchTerm.trim() === "") {
          const allMovies = await moviesListAPI();
          setFilteredMovies([]);
          setAllMovies(allMovies);
          setNoResults(false);
        } else {
          const searched = await getSearchedMovies(searchTerm);
          setFilteredMovies(searched);
          setNoResults(searched.length === 0);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  const handleResetSearchTerm = () => {
    setSearchTerm("");
  };

  if (noResults) {
    return (
      <View style={styles.container}>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleResetSearchTerm={handleResetSearchTerm}
        />

        <Text style={styles.message}>No results found.</Text>
      </View>
    );
  }

  const handleMoviesSection = ({ item }) => {
    return (
      <View>
        <MovieSection movie={item} isLoading={isLoading} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleResetSearchTerm={handleResetSearchTerm}
      />

      {searchTerm.length <= 0 && (
        <Text style={styles.labelText}>All Movies</Text>
      )}

      <FlatList
        data={filteredMovies.length > 0 ? filteredMovies : allMovies}
        keyExtractor={(item) => item._id}
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
  message: {
    color: "white",
    textAlign: "center",
    marginTop: 200,
    fontSize: 16,
    fontWeight: "bold",
  },
  labelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
