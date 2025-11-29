import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import SearchInput from "../components/SearchInput";
import BlankComponent from "../components/BlankComponent";
import { Skeleton } from "moti/skeleton";
import { showsListAPI, getSearchedShows } from "../api/showsListAPI";
import ShowSection from "../components/ShowSection";

export default function ShowsSearchScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [allShows, setAllShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchShows = async () => {
      setIsLoading(true);
      try {
        if (debouncedSearchTerm.trim() === "") {
          const allShows = await showsListAPI();
          setFilteredShows([]);
          setAllShows(allShows);
          setNoResults(false);
        } else {
          const searched = await getSearchedShows(debouncedSearchTerm.trim());
          setFilteredShows(searched);
          setNoResults(searched.length === 0);
        }
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [debouncedSearchTerm]);

  const handleResetSearchTerm = () => {
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleResetSearchTerm={handleResetSearchTerm}
        />

        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.subContainer}>
            {/* Poster Skeleton */}
            <View style={styles.skeletonPoster}>
              <Skeleton colorMode="dark" radius={5} width={80} height={120} />
            </View>

            <View>
              {/* Title Skeleton */}
              <View style={styles.skeletonTitle}>
                <Skeleton colorMode="dark" width="70%" height={16} />
              </View>

              {/* Genres Skeleton */}
              <View style={[styles.genresContainer, { paddingTop: 10 }]}>
                <View style={styles.skeletonGenre}>
                  {[...Array(2)].map((_, genreIndex) => (
                    <Skeleton
                      key={genreIndex}
                      colorMode="dark"
                      width={60}
                      height={20}
                    />
                  ))}
                </View>
              </View>

              {/* Ratings Skeleton */}
              <View style={styles.skeletonRuntime}>
                <Skeleton colorMode="dark" width={50} height={14} />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

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

  const handleShowsSection = ({ item }) => {
    return (
      <View>
        <ShowSection show={item} isLoading={isLoading} />
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

      {debouncedSearchTerm.length <= 0 && (
        <Text style={styles.labelText}>All TV Shows ({allShows.length})</Text>
      )}

      <FlatList
        data={filteredShows.length > 0 ? filteredShows : allShows}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={handleShowsSection}
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
    marginTop: 40,
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
  skeletonPoster: {
    width: 80,
    height: 80,
    marginTop: 15,
  },
  skeletonTitle: {
    width: "auto",
    height: 16,
    borderRadius: 5,
    marginTop: 30,
  },
  skeletonGenre: {
    width: 60,
    height: 20,
    borderRadius: 5,
    marginRight: 5,
    flexDirection: "row",
    gap: 5,
  },
  skeletonRuntime: {
    width: 50,
    height: 14,
    borderRadius: 5,
    marginTop: 10,
  },
  skeletonDeleteButton: {
    position: "absolute",
    right: 20,
    top: 100,
  },
});
