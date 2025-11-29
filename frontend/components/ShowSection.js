import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import formatDate from "../utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default function ShowSection({
  show,
  isLoading,
  showWatchedShowsDeleteButton,
  handleWatchedShowsDeleteButton,
}) {
  const navigation = useNavigation();

  const handleShowDetails = () => {
    navigation.navigate("ShowsDetailsScreen", {
      show: show,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
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
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    colorMode="dark"
                    width={60}
                    height={20}
                  />
                ))}
              </View>
            </View>

            <View style={styles.skeletonRuntime}>
              <Skeleton colorMode="dark" width={50} height={14} />
            </View>
          </View>

          {/* Delete Button Skeleton */}
          {showWatchedShowsDeleteButton && (
            <View style={styles.skeletonDeleteButton}>
              <Skeleton colorMode="dark" width={60} height={30} />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleShowDetails}
        style={styles.subContainer}
        activeOpacity={0.8}
      >
        <Image source={{ uri: show.posterPath }} style={styles.posterImage} />

        <View style={styles.showDetailsContainer}>
          <Text style={styles.showOriginalTitle}>
            {show.name} ({formatDate(show.releaseDate).split("-")[0]})
          </Text>

          <View style={styles.genresContainer}>
            {show.genres.slice(0, 2).map((genre, i) => (
              <Text key={i} style={styles.showGenres}>
                {genre}
              </Text>
            ))}
          </View>

          <View style={styles.runtimeContainer}>
            <EntypoIcon
              name="star"
              size={12}
              color="#daa520"
              style={{ paddingTop: 18 }}
            />
            <Text style={styles.showRatings}>
              {Number(show.ratings).toFixed(1)}
            </Text>
          </View>
        </View>

        {showWatchedShowsDeleteButton && (
          <TouchableOpacity
            onPress={() => handleWatchedShowsDeleteButton(show._id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginLeft: 10,
    flexDirection: "row",
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  showDetailsContainer: {
    width: "100%",
    height: "100%",
  },
  showOriginalTitle: {
    color: "#f0f0f0",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 30,
    paddingRight: 40,
    paddingLeft: 10,
    width: 350,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    paddingLeft: 10,
    paddingTop: 10,
  },
  showGenres: {
    color: "#f0f0f0",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 3,
    backgroundColor: "#333",
  },
  runtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  showRatings: {
    color: "#f0f0f0",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 18,
    paddingLeft: 5,
  },
  deleteButton: {
    position: "absolute",
    right: 20,
    top: 100,
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginRight: 60,
  },
  skeletonPoster: {
    width: 80,
    height: 120,
    marginBottom: 10,
    marginTop: 15,
  },
  skeletonTitle: {
    width: "auto",
    height: 16,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 10,
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
    marginTop: 18,
    marginLeft: 10,
  },
  skeletonDeleteButton: {
    position: "absolute",
    right: 20,
    top: 100,
  },
});
