import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getSimilarShows } from "../api/showsListAPI";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";

export default function RelatedShows({ showId }) {
  const navigation = useNavigation();
  const [relatedShows, setRelatedShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarShows = async () => {
      try {
        const similarShows = await getSimilarShows(showId);
        setRelatedShows(similarShows);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching similar shows:", error);
      }
    };

    fetchSimilarShows();
  }, [showId]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledRelatedShows = shuffleArray(relatedShows);

  const handleShowDetails = (show) => {
    navigation.push("ShowsDetailsScreen", {
      show: show,
    });
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

  const renderSimilarShows = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleShowDetails(item)}
        activeOpacity={0.8}
        style={styles.similarShowsContainer}
      >
        <Image
          source={{ uri: item.posterPath }}
          style={styles.similarShowsImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.relatedShowsText}>Related</Text>

      <FlatList
        data={shuffledRelatedShows.slice(0, 10)}
        keyExtractor={(item) => item._id}
        renderItem={renderSimilarShows}
        windowSize={2}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 17,
    height: 280,
    marginTop: -30,
  },
  relatedShowsText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "bold",
  },
  similarShowsContainer: {
    marginRight: 12,
    paddingTop: 15,
  },
  similarShowsImage: {
    borderRadius: 5,
    width: 150,
    height: "100%",
  },
  skeletonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
});
