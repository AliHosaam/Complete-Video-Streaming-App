import { useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ShowSection from "../components/ShowSection";
import BlankComponent from "../components/BlankComponent";
import { Skeleton } from "moti/skeleton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getAllWatchedShows,
  removeAllWatchedShow,
  removeWatchedShow,
} from "../api/userShowWatchtimeAPI";

export default function ShowsHistoryScreen() {
  const navigation = useNavigation();
  const [watchedShows, setWatchedShows] = useState([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchWatchedShows = async () => {
        setIsLoading(true);
        try {
          const response = await getAllWatchedShows();
          setWatchedShows(response.watchedShows);
        } catch (error) {
          console.error("Error fetching watched shows:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchWatchedShows();
    }, [reload])
  );

  const handleWatchedShowsDeleteButton = async (showId) => {
    try {
      const response = await removeWatchedShow(showId);
      setWatchedShows(response);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error deleting watched show:", error);
    }
  };

  const handleDeleteAllWatchedShows = async () => {
    try {
      const response = await removeAllWatchedShow();
      setWatchedShows(response);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error deleting all watched shows:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Back button skeleton */}
        <View style={styles.backButtonSkeleton}>
          <Skeleton colorMode="dark" radius={20} width={40} height={40} />
        </View>

        {/* Header skeleton */}
        <View style={styles.subContainer}>
          {/* "All History" text skeleton */}
          <View style={styles.skeletonHeaderText}>
            <Skeleton colorMode="dark" width={120} height={24} radius={5} />
          </View>

          {/* "Delete all" button skeleton */}
          <View style={styles.skeletonDeleteAllButton}>
            <Skeleton colorMode="dark" width={80} height={35} radius={5} />
          </View>
        </View>

        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.showItemContainer}>
            {/* Poster Skeleton */}
            <View style={styles.skeletonPoster}>
              <Skeleton colorMode="dark" radius={5} width={80} height={120} />
            </View>

            <View>
              {/* Title Skeleton */}
              <View style={styles.skeletonTitle}>
                <Skeleton colorMode="dark" width={200} height={16} />
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

            {/* Delete Button Skeleton */}
            <View style={styles.skeletonDeleteButton}>
              <Skeleton colorMode="dark" width={60} height={30} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (watchedShows.length <= 0) {
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

  const handleShowsSection = ({ item }) => {
    return (
      <View>
        <ShowSection
          show={item.show}
          isLoading={isLoading}
          showWatchedShowsDeleteButton
          handleWatchedShowsDeleteButton={handleWatchedShowsDeleteButton}
        />
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
        <Text style={styles.labelText}>All History</Text>

        <TouchableOpacity
          onPress={handleDeleteAllWatchedShows}
          style={styles.deleteAllButton}
        >
          <Text style={styles.deleteAllText}>Delete all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={watchedShows}
        keyExtractor={(item) => item.show._id}
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  backButtonSkeleton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
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
  deleteAllButton: {
    backgroundColor: "#ff0000",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 190,
    marginBottom: 10,
    paddingVertical: 10,
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
  skeletonHeaderText: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  skeletonDeleteAllButton: {
    marginLeft: 190,
    marginBottom: 10,
  },
  showItemContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    gap: 10,
    marginTop: 5,
    paddingBottom: 40,
  },
  skeletonPoster: {
    width: 80,
    height: 80,
    marginTop: 15,
    marginLeft: 10,
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
